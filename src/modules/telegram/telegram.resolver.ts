import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { TelegramService } from './telegram.service'

@Resolver('TelegramResolver')
export class TelegramResolver {
  constructor(private readonly telegramService: TelegramService) {}
//   @Mutation()
//   async sendMessage(
//     @Args('chatId') chatId: string,
//     @Args('message') message: string
//   ) {
//     const result = await this.telegramService.sendMessage(chatId, message)
//     return result
//   }
}
