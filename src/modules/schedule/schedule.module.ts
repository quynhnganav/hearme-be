import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DATABASE_COLLECTIONS } from "../../constant";
import { DoctorModule } from "../doctor/doctor.module";
import { UserModule } from "../user/user.module";
import { ScheduleResolver } from "./schedule.resolver";
import { ScheduleService } from "./schedule.service";
import { ScheduleSchema } from "./schema/schedule.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: DATABASE_COLLECTIONS.SCHEDULE, schema: ScheduleSchema }
        ]),
        UserModule,
        DoctorModule
    ],
    providers: [ScheduleService, ScheduleResolver],
    exports: [ScheduleService]
})
export class ScheduleModule {}