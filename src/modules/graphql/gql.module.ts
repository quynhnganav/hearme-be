import { ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { AuthenticationError, ValidationError } from 'apollo-server-express'
import { GraphQLError } from 'graphql'
import { join } from 'path'
import { APP_PERMISSIONS, HEADER_TOKEN_KEY } from '../../constant'
import { AuthModule } from "../auth/auth.module";
import { AuthService } from "../auth/auth.service";
import { ConfigurationService } from '../config/config.service'
import { UserModule } from "../user/user.module";
import { UserService } from "../user/user.service";
import { PubSub } from 'graphql-subscriptions'
import { DoctorModule } from '../doctor/doctor.module'
import { DoctorService } from '../doctor/doctor.service'
import { indexOf } from 'lodash'

export const pubsub = new PubSub()

export default GraphQLModule.forRootAsync({
  imports: [UserModule, AuthModule, DoctorModule],
  useFactory: async (
    userService: UserService, authService: AuthService,
    doctorService: DoctorService, configService: ConfigurationService) => ({
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/schema.ts')
      },
      installSubscriptionHandlers: false,
      path: configService.getGQLEndpointPath(),
      bodyParserConfig: { limit: '50mb' },
      // cors:
      //   configService.getNodeEnv() === 'production'
      //     ? {
      //       origin: 'xxx',
      //       credentials: true // <-- REQUIRED backend setting
      //     }
      //     : true,
      playground: configService.getNodeEnv() !== 'production' && {
        settings: {
          'editor.cursorShape': 'underline', // possible values: 'line', 'block', 'underline'
          'editor.fontFamily': `'Source Code Pro', 'Consolas', 'Inconsolata', 'Droid Sans Mono', 'Monaco', monospace`,
          'editor.fontSize': 14,
          'editor.reuseHeaders': true, // new tab reuses headers from last tab
          'editor.theme': 'dark', // possible values: 'dark', 'light'
          'general.betaUpdates': true,
          'queryPlan.hideQueryPlanResponse': false,
          'request.credentials': 'include', // possible values: 'omit', 'include', 'same-origin'
          'tracing.hideTracingResponse': false
        }
      },
      subscriptions: {
        // path: configService.getGQLEndpointPath(),
        keepAlive: 3000,
        onConnect: async (connectionParams) => {
          configService.getNodeEnv() !== 'production' &&
            console.debug(`🔗  Connected to websocket`, 'GraphQL')

          const token = connectionParams[HEADER_TOKEN_KEY]

          if (token) {
            const { user } = await authService.verifyToken(token)
            const permissions = await (await authService.findPermissionOfUser(user)).map(p => p.code) || []
            // permissions = await (await authService.findPermissionOfUser(user)).map(p => p.code) || []
            // ctxWithValue['currentUser'] = user
            return { currentAccount: user, permissions }
          }

          if (!token) {
            const currentAccount = {}
            return { currentAccount }
          }
          return false

          throw new AuthenticationError(
            'Authentication token is invalid, please try again.'
          )
        },
        onDisconnect: () => {
          configService.getNodeEnv() !== 'production' &&
            console.error(`❌  Disconnected to websocket`, '', 'GraphQL', false)
        }
      },
      context: async ({ req: request, connection }: { req: Request, connection: any }): Promise<any> => {

        if (connection) {
          const { currentAccount, permissions } = connection.context
          return {
            pubsub,
            currentAccount,
            permissions
          }
        }
        // QUERY-MUTATION
        let ctxWithValue = {}
        let permissions = []
        if (HEADER_TOKEN_KEY in request.headers) {
          try {
            const token = request.headers[HEADER_TOKEN_KEY]
            const { user, session } = await authService.verifyToken(token)
            if (!user) return { req: request, permissions, ...ctxWithValue }
            permissions = await (await authService.findPermissionOfUser(user)).map(p => p.code) || []
            if ( indexOf(permissions, APP_PERMISSIONS.DOCTOR_USER) > -1 || indexOf(permissions, APP_PERMISSIONS.DOCTOR_USER_PENDING) > -1 ) {
              const doctor = await doctorService.findByUserId(user._id)
              if (doctor) ctxWithValue['doctor'] = doctor
            }
            ctxWithValue['currentUser'] = user
            ctxWithValue['session'] = session
          } catch (error) {
          }
        }
        return { req: request, pubsub, permissions, ...ctxWithValue }
      },
      // ERROR FORMAT CONFIGURATION - THIS IS CRUCIAL TO CHANGE, ASK YOUR LEADER BEFORE
      // MAKING ANY CHANGE
      formatError: (error: GraphQLError) => {
        // Handle validation errors passed from global exception filter (which originally emit from class validator)
        if (error.extensions.code === 'INVALID_ARGUMENTS') {
          return {
            message: error.message,
            code: error.extensions.code,
            details: error.extensions.errors.map(({ constraints, property }) => ({
              property,
              constraints
            }))
          }
        }
        // Handle throw or return ApolloError by user
        const graphQLFormattedError = {
          message: error.message,
          code:
            error.extensions?.code ||
            error.extensions?.exception?.code ||
            'UNKNOWN'
        }
        return graphQLFormattedError
      }
    }),
  inject: [UserService, AuthService, DoctorService, ConfigurationService]
})
