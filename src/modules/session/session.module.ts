import { forwardRef, Module } from '@nestjs/common';
import { SessionResolver } from './session.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_COLLECTIONS } from '../../constant';
import { SessionSchema } from './schema/session.schema';
import { UserModule } from '../user/user.module';
import { SessionService } from "./session.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DATABASE_COLLECTIONS.SESSION, schema: SessionSchema }
    ]),
    forwardRef(() => UserModule)
  ],
  providers: [SessionService, SessionResolver],
  exports: [SessionService],
})
export class SessionModule {}
