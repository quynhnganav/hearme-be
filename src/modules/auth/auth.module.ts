import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver, RoleResolver } from './auth.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_COLLECTIONS } from '../../constant';
import { PermissionSchema } from './schema/permission.schema';
import { RoleSchema } from './schema/role.schema';
import { UserModule } from '../user/user.module';
import { SessionModule } from '../session/session.module';
import { JwtModule } from "@nestjs/jwt";
import ConfigModule from '../config/config.module';
import { ConfigurationService } from '../config/config.service';
import { MicroserviceModule } from '../microservices/microservice.module';
import { TelegramModule } from '../telegram/telegram.module';
import { ScheduleModule } from '../schedule/schedule.module';
import { QueueModule } from '../queue/queue.module';
import { BullModule } from '@nestjs/bull';
import { MailProcessor } from '../queue/mail.process';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: DATABASE_COLLECTIONS.PERMISSION, schema: PermissionSchema },
            { name: DATABASE_COLLECTIONS.ROLE, schema: RoleSchema }
        ]),
        forwardRef(() => UserModule),
        // forwardRef(() => ScheduleModule),
        SessionModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigurationService) => {
                return {
                    secret: configService.getTokenEncryptSecret(),
                    signOptions: { algorithm: "HS512", expiresIn: "10d" },
                }
            },
            inject: [ConfigurationService]
        }),
        MicroserviceModule,
        TelegramModule,
        BullModule.registerQueue({
            name: 'mail',
        }),
    ],
    providers: [AuthService, AuthResolver, RoleResolver, MailProcessor],
    exports: [AuthService]
})
export class AuthModule { }
