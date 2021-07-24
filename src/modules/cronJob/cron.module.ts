import { forwardRef, Module } from "@nestjs/common";
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from "./cron.service";

@Module({
    imports: [
        ScheduleModule.forRoot()
    ],
    providers: [TasksService],
    exports: [TasksService]
})
export class CronJobModule {
}