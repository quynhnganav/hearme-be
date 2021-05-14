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

@Module({
  imports: [
    ConfigModule,
    MongooseModule,
    GraphQLModule,
    HistoryModule,
    AuthModule,
    UserModule,
    PostModule
  ],
  controllers: [AppController],
  providers: [AppService, SubscriptionResolver],
})
export class AppModule {}
