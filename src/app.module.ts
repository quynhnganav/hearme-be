import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import ConfigModule from "./modules/config/config.module";
import MongooseModule from "./modules/mongoose/mongoose.module";
import GraphQLModule from "./modules/graphql/gql.module";
import { AuthModule } from "./modules/auth/auth.module";
import { HistoryModule } from './modules/history/history.module';
import { PostModule } from './modules/post/post.module';
import { SubscriptionResolver } from './modules/subscription/subscription.resolver';
import { UpdaloadController } from './controller/upload.controller';
import { DoctorModule } from './modules/doctor/doctor.module';
import { ScheduleModule } from './modules/schedule/schedule.module';
import { MicroserviceModule } from './modules/microservices/microservice.module';
import { PubsubModule } from './modules/pubsub/pubsub.module';

@Module({
  imports: [
    ConfigModule,
    MongooseModule,
    GraphQLModule,
    HistoryModule,
    AuthModule,
    UserModule,
    PostModule,
    DoctorModule,
    ScheduleModule,
    MicroserviceModule,
    PubsubModule
  ],
  controllers: [AppController, UpdaloadController],
  providers: [AppService, SubscriptionResolver],
})
export class AppModule {}
