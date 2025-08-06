import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { HealthResponse } from 'src/common/dto/status.response';
import { AuthService } from './auth.service';
import { Request } from 'express';
// import { ReqData } from 'src/common/types';
import { LoginInput, RegisterInput } from './auth.inputs';
import { AuthResponse } from './auth.response';
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @ApiOkResponse({
    description: 'Health check for user service',
    type: HealthResponse,
  })
  @Get('health')
  health() {
    return this.auth.health();
  }

  @ApiOkResponse({ type: AuthResponse })
  @ApiBody({ type: RegisterInput })
  @Post('register')
  register(@Req() req: Request, @Body() data: RegisterInput) {
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const ipAddress = req.ip || 'Unknown';
    return this.auth.register(userAgent, ipAddress, data);
  }

  @ApiOkResponse({ type: AuthResponse })
  @ApiBody({ type: LoginInput })
  @Post('login')
  login(@Req() req: Request, @Body() data: LoginInput) {
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const ipAddress = req.ip || 'Unknown';
    return this.auth.login(userAgent, ipAddress, data);
  }
}
