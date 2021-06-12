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

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: DATABASE_COLLECTIONS.PERMISSION, schema: PermissionSchema },
            { name: DATABASE_COLLECTIONS.ROLE, schema: RoleSchema }
        ]),
        forwardRef(() => UserModule),
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
        MicroserviceModule
    ],
    providers: [AuthService, AuthResolver, RoleResolver],
    exports: [AuthService]
})
export class AuthModule { }
