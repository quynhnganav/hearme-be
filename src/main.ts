import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app.module'
import { Authencation } from './modules/auth/guard/authentication.guard'
import { PermissionGuard } from './modules/auth/guard/permission.guard'
import { ConfigurationService } from './modules/config/config.service'
import { GQLAgumentGuard } from './modules/graphql/gql.arg.guard'
import { GQLArgValidationFailedError } from './modules/graphql/gql.error'
import { ApolloErrorFilter, DocumentValidationErrorFilter } from './modules/graphql/gql.exception.filter'
import { LoggingInterceptor } from './interceptor/logging.interceptor'
import * as bodyParser from 'body-parser'
import { NestExpressApplication } from '@nestjs/platform-express'
import { IoAdapter } from '@nestjs/platform-socket.io'

declare const module: any

const logger = new Logger('Main')


export class WebSocketApdapter extends IoAdapter {
  createIOServer(port: number): any {
    const server = super.createIOServer(port);
    return server;
  }
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  const appPort = app.get(ConfigurationService).getAppListeningPort()

  app.useGlobalGuards(new GQLAgumentGuard(new Reflector()))
  app.useGlobalGuards(new Authencation(new Reflector()))
  app.useGlobalGuards(new PermissionGuard(new Reflector()))
  app.useGlobalFilters(new ApolloErrorFilter())

  app.useGlobalPipes(new ValidationPipe({
    exceptionFactory: errors => {
      return new GQLArgValidationFailedError(errors)
    }
  }))

  app.useGlobalFilters(new DocumentValidationErrorFilter())
  app.useGlobalInterceptors(new LoggingInterceptor())
  app.use(bodyParser.json({ limit: '50mb' }))
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 1000000}))
  app.enableCors()
  app.useWebSocketAdapter(new WebSocketApdapter(app))
  
  await app.listen(appPort, () => {
    const mongoUri = app.get(ConfigurationService).getMongoURI()
    const gqlEndpoint = app.get(ConfigurationService).getGQLEndpointPath()
    logger.debug('Database uri: ' + mongoUri)
    logger.debug('App is listening on port ' + appPort)
    logger.debug('GraphQL server is serving at ' + gqlEndpoint)
  })

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }

}
bootstrap()
