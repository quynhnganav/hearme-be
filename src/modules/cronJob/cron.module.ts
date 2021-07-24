import { BullModule } from "@nestjs/bull";
import { forwardRef, Module } from "@nestjs/common";
import { ScheduleModule } from '@nestjs/schedule';
import { MailProcessor } from "../queue/mail.process";
import { TasksService } from "./cron.service";
import { ScheduleModule as AppoinmentModule } from '../schedule/schedule.module'

@Module({
    imports: [
        ScheduleModule.forRoot(),
        BullModule.registerQueue({
            name: 'mail',
        }),
        AppoinmentModule
    ],
    providers: [TasksService],
    exports: [TasksService]
})
export class CronJobModule {
}