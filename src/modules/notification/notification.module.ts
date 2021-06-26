import { Module } from "@nestjs/common";
import { PubsubModule } from "../pubsub/pubsub.module";


@Module({
    imports: [
        PubsubModule
    ],
    exports: [

    ]
})
export class NotificationModule {}