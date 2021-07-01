import { Module } from '@nestjs/common'
import { TelegramService } from './telegram.service'
import { TelegramResolver } from './telegram.resolver'

@Module({
  imports: [],
  providers: [TelegramService, TelegramResolver],
  exports: [TelegramService]
})
export class TelegramModule {}
