import { ApolloError } from 'apollo-server-express'

export class TelegrafError extends ApolloError {
  private static code = 'ERR_SEND_MESSAGE_TELEGRAM'
  constructor(message?: string) {
    super(message, TelegrafError.code)
  }
}
