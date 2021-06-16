import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { NotAuthentication } from './modules/auth/decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @NotAuthentication()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
