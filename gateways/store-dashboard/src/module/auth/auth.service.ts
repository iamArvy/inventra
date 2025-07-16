import { Inject, Injectable } from '@nestjs/common';
import { LoginInput, RegisterInput } from 'src/module/auth/auth.inputs';
import { ClientGrpc } from '@nestjs/microservices';
import {
  AUTH_SERVICE_NAME,
  AuthServiceClient,
} from 'src/common/proto/auth/auth';
import { AppService } from 'src/app.service';

@Injectable()
export class AuthService extends AppService<AuthServiceClient> {
  constructor(@Inject('auth') client: ClientGrpc) {
    super(client, AUTH_SERVICE_NAME);
  }

  health() {
    return this.service.health({});
  }

  async register(userAgent: string, ipAddress: string, data: RegisterInput) {
    const response = await this.call(
      this.service.register({
        userAgent,
        ipAddress,
        data,
        storeId: 'store-id',
      }),
    );
    if (response)
      this.logger.log(
        `User registered from agent: ${userAgent} with IP Address: ${ipAddress} using email: ${data.email}`,
      );
    return response;
  }

  async login(userAgent: string, ipAddress: string, data: LoginInput) {
    const response = await this.call(
      this.service.login({ userAgent, ipAddress, data }),
    );
    if (response)
      this.logger.log(
        `User with email: ${data.email} Logged in from agent: ${userAgent} and IP Address: ${ipAddress}`,
      );
    return response;
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
