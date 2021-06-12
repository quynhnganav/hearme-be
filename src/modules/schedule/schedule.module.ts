import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DATABASE_COLLECTIONS } from "../../constant";
import { UserModule } from "../user/user.module";
import { ScheduleService } from "./schedule.service";
import { ScheduleSchema } from "./schema/schedule.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: DATABASE_COLLECTIONS.SCHEDULE, schema: ScheduleSchema }
        ]),
        UserModule
    ],
    providers: [ScheduleService],
    exports: [ScheduleService]
})
export class ScheduleModule {}