import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  AUTH_SERVICE_NAME,
  AuthResponse,
  AuthServiceClient,
  LoginData,
  RegisterData,
} from 'src/common/proto/auth/auth';
import { BaseClient } from '../base.client';
import { Observable } from 'rxjs';
import { Status, TokenData } from 'common/proto/auth/common';

@Injectable()
export class AuthGrpcClient extends BaseClient<AuthServiceClient> {
  constructor(@Inject('auth') client: ClientGrpc) {
    super(client, AUTH_SERVICE_NAME);
  }

  health(): Observable<Status> {
    return this.service.health({});
  }

  async register(
    userAgent: string,
    ipAddress: string,
    data: RegisterData,
    storeId: string,
  ): Promise<AuthResponse> {
    return this.call(
      this.service.register({
        userAgent,
        ipAddress,
        data,
        storeId,
      }),
    );
  }

  async login(
    userAgent: string,
    ipAddress: string,
    data: LoginData,
  ): Promise<AuthResponse> {
    return this.call(this.service.login({ userAgent, ipAddress, data }));
  }

  refreshToken(token: string): Promise<TokenData> {
    return this.call(this.service.refreshToken({ token }));
  }

  logout(token: string): Promise<Status> {
    return this.call(this.service.logout({ token }));
  }

  getClientToken(id: string, secret: string): Promise<TokenData> {
    return this.call(this.service.getClientToken({ id, secret }));
  }
}
