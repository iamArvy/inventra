import { Status } from 'src/common/dto/app.response';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { TokenInput } from 'src/common/dto/app.inputs';
import { AuthService } from './auth.service';
import {
  AuthInput,
  RegisterInput,
  ClientTokenRequest,
  LoginData,
} from './auth.inputs';
import { AuthResponse, TokenData } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @GrpcMethod('AuthService')
  health(): Status {
    return { success: true };
  }

  @GrpcMethod('AuthService')
  register(data: RegisterInput): Promise<AuthResponse> {
    return this.service.signup(
      data.storeId,
      data.data,
      data.userAgent,
      data.ipAddress,
    );
  }

  @GrpcMethod('AuthService')
  login(data: AuthInput<LoginData>): Promise<AuthResponse> {
    return this.service.login(data.data, data.userAgent, data.ipAddress);
  }

  @GrpcMethod('AuthService')
  refreshToken({ token }: TokenInput): Promise<TokenData> {
    return this.service.refreshToken(token);
  }

  @GrpcMethod('AuthService')
  logout({ token }: TokenInput): Promise<Status> {
    return this.service.logout(token);
  }

  @GrpcMethod('AuthService')
  getClientToken({ id, secret }: ClientTokenRequest): Promise<TokenData> {
    return this.service.getClientToken(id, secret);
  }
}
