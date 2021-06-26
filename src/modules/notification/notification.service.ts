import { Injectable } from "@nestjs/common";
import { PubSubSocket } from "../pubsub/pubsub.gateway";
import { Schedule } from "../schedule/schema/schedule.schema";

@Injectable()
export class NotificationService {


    constructor(
        private pubSub: PubSubSocket
    ){}

    async notiNewSchedule(schedule: Schedule, user_id: string) {

    }

}