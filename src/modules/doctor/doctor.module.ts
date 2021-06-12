import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DATABASE_COLLECTIONS } from "../../constant";
import { UserModule } from "../user/user.module";
import { DoctorService } from "./doctor.service";
import { DoctorSchema } from "./schema/doctor.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: DATABASE_COLLECTIONS.DOCTOR, schema: DoctorSchema }
        ]),
        UserModule
    ],
    providers: [DoctorService],
    exports: [DoctorService]
})
export class DoctorModule {}