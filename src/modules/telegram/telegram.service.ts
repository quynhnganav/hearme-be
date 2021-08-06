import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Telegraf } from 'telegraf'
import { TelegrafError } from './telegraf.error'



@Injectable()
export class TelegramService implements OnModuleInit, OnModuleDestroy {

  private token = "1886858680:AAFrjNDloVjWvKmKmCmBf9oluzypoBchRf0"
  private bot

  constructor(
  ) { }

  async sendMessage(
    chatId: string | number,
    message: string
  ): Promise<Boolean> {
    try {
      await this.bot.telegram.sendMessage(chatId, message, {
        // parse_mode: 'MarkdownV2'
      })
      return true
    } catch (err) {
      throw new TelegrafError(err.response.description)
    }
  }
  onModuleInit() {
    this.bot = new Telegraf(this.token)
    this.bot.launch()
  }
  onModuleDestroy() {
    this.bot.stop()
  }
}
