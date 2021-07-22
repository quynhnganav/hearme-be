import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { NotAuthentication } from './modules/auth/decorator';
import { PubSubSocket } from './modules/pubsub/pubsub.gateway';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly pubSub: PubSubSocket
  ) { }

  @NotAuthentication()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @NotAuthentication()
  @Get('test')
  testGet(
    @Body() body
  ): any {
    console.log(body)
    return 1;
  }


}
