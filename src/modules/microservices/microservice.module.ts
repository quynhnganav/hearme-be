import { Module } from "@nestjs/common";
import { ConfigurationService } from "../config/config.service";
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import ConfigModule from "../config/config.module";
import { MicroserviceService } from "./microservice.service";

@Module({
    imports: [
        ConfigModule
    ],
    providers: [
        {
            provide: 'EVENTS_SERVICE',
            useFactory: (configService: ConfigurationService) => {
                return ClientProxyFactory.create({
                    options: {
                        host: 'localhost',
                        port: 2201
                    },
                    transport: Transport.TCP
                });
            },
            inject: [ConfigurationService],
        },
        MicroserviceService
    ],
    exports: [MicroserviceService]
})
export class MicroserviceModule { }