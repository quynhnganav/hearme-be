import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DATABASE_COLLECTIONS } from "../../constant";
import { AuthModule } from "../auth/auth.module";
import { UserModule } from "../user/user.module";
import { DoctorResolver } from "./doctor.resolver";
import { DoctorService } from "./doctor.service";
import { DoctorSchema } from "./schema/doctor.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: DATABASE_COLLECTIONS.DOCTOR, schema: DoctorSchema }
        ]),
        UserModule,
        AuthModule
    ],
    providers: [DoctorService, DoctorResolver],
    exports: [DoctorService]
})
export class DoctorModule {}