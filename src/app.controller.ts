import { Controller, Get, HttpException } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('App Status')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @ApiOperation({ summary: "Get app status" })
  @Get()
  getHello(): string {
    throw new HttpException("Helo", 200);
    return this.appService.getHello();
  }
}
