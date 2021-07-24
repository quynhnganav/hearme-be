
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MailProcessor } from './mail.process';

@Module({
    imports: [
        BullModule.forRoot({
            redis: {
                host: '127.0.0.1',
                port: 6379,
            }
        })
    ],
    // providers: [MailProcessor]
})
export class QueueModule { }