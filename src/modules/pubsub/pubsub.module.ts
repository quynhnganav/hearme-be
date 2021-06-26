import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PubSubSocket } from './pubsub.gateway';

@Module({
    imports: [
        AuthModule
    ],
    providers: [PubSubSocket],
    exports: [PubSubSocket],
})
export class PubsubModule {}
