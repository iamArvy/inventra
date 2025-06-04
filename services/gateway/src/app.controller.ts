import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  getHealth(): string {
    return { status: 'OKmn' }.status;
  }
}
