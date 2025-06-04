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
import { AuthService } from './auth.interface';
import { HealthResponse } from 'src/dto/status.response';

@Controller('auth')
export class AuthController implements OnModuleInit {
  constructor(@Inject('auth') private client: ClientGrpc) {}
  private authService: AuthService;
  onModuleInit() {
    this.authService = this.client.getService<AuthService>('AuthService');
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
