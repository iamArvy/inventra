import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  AuthInput,
  LoginData,
  RegisterInput,
  TokenInput,
} from 'src/common/dto/app.inputs';
import { AuthService } from './auth.service';
import { ClientTokenRequest } from './auth.inputs';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @GrpcMethod('AuthService')
  health() {
    return { success: true };
  }

  @GrpcMethod('AuthService')
  register(data: RegisterInput) {
    return this.service.signup(
      data.storeId,
      data.data,
      data.userAgent,
      data.ipAddress,
    );
  }

  @GrpcMethod('AuthService')
  login(data: AuthInput<LoginData>) {
    return this.service.login(data.data, data.userAgent, data.ipAddress);
  }

  @GrpcMethod('AuthService')
  refreshToken({ token }: TokenInput) {
    return this.service.refreshToken(token);
  }

  @GrpcMethod('AuthService')
  logout({ token }: TokenInput) {
    return this.service.logout(token);
  }

  @GrpcMethod('AuthService')
  getClientToken({ id, secret }: ClientTokenRequest) {
    return this.service.getClientToken(id, secret);
  }
}
