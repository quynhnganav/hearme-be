import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from '@nestjs/microservices'

@Injectable()
export class MicroserviceService {

    constructor(
        @Inject('EVENTS_SERVICE') private eventsProxy: ClientProxy
    ) { }


    async sendNoti() {
        this.eventsProxy.emit('sendNoti', { data: ['123'], userID: '1212313' })
    }

}