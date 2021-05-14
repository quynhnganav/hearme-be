import { Context, Resolver, Subscription } from '@nestjs/graphql'
import { ApolloError } from 'apollo-server-express'

@Resolver('Subscription')
export class SubscriptionResolver {
  @Subscription('subApp', {
    filter: (payload, variables) => {
      const { module } = payload
      const { modules } = variables
      return (
        modules.includes(module) &&
        (payload.idNode === variables.idNode || payload.isFullNode)
      )
    },
    resolve: (payload) => {
      try {
        return payload
      } catch (error) {
        throw new ApolloError(error)
      }
    }
  })
  subApp(@Context('pubsub') pubSub) {
    try {
      return pubSub.asyncIterator('subApp')
    } catch (error) {
      throw new ApolloError(error)
    }
  }
}
