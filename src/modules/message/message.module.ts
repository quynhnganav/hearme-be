import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DATABASE_COLLECTIONS } from "../../constant";
import { UserModule } from "../user/user.module";
import { MessageSchema } from "./schema/message.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: DATABASE_COLLECTIONS.MESSAGE, schema: MessageSchema }
        ]),
        UserModule
    ],
    providers: [],
    exports: []
})
export class MessageModule {}