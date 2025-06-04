import { GrpcMethod } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { LoginInput, RegisterInput } from './dto/auth.inputs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @GrpcMethod('AuthService', 'health')
  health() {
    return { status: 'OK', timestamp: new Date().toISOString() };
  }

  @GrpcMethod('AuthService', 'register')
  async register(data: any) {
    return this.appService.register(data as RegisterInput);
  }

  @GrpcMethod('AuthService', 'login')
  async login(data: any) {
    return this.appService.login(data as LoginInput);
  }
}
