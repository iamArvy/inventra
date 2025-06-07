import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Post,
} from '@nestjs/common';
import { LoginInput, RegisterInput } from './dto/auth.inputs';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { AuthResponse } from './dto/auth.response';
import { ClientGrpc } from '@nestjs/microservices';
import { HealthResponse } from 'src/dto/status.response';
import { AUTH_SERVICE_NAME, AuthServiceClient } from 'src/generated/auth';

@Controller('auth')
export class AuthController implements OnModuleInit {
  constructor(@Inject('auth') private client: ClientGrpc) {}
  private authService: AuthServiceClient;
  onModuleInit() {
    this.authService =
      this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  @ApiOkResponse({
    description: 'Health check for user service',
    type: HealthResponse,
  })
  @Get('health')
  health() {
    return this.authService.health({});
  }

  @ApiOkResponse({ type: AuthResponse })
  @ApiBody({ type: RegisterInput })
  @Post('register')
  register(@Body() data: RegisterInput) {
    return this.authService.register(data);
  }

  @ApiOkResponse({ type: AuthResponse })
  @ApiBody({ type: LoginInput })
  @Post('login')
  login(@Body() data: LoginInput) {
    return this.authService.login(data);
  }
}
