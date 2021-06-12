import { Module } from '@nestjs/common';
import { PubSubSocket } from './pubsub.gateway';

@Module({
    providers: [PubSubSocket]
})
export class PubsubModule {}
