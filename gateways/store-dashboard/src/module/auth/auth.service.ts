import { Injectable, Logger } from '@nestjs/common';
import { LoginInput, RegisterInput } from 'src/module/auth/auth.inputs';
import { AuthClient } from '@grpc-clients/auth/auth.client';

@Injectable()
export class AuthService {
  constructor(private client: AuthClient) {}

  protected readonly logger = new Logger(this.constructor.name);
  health() {
    return this.client.health();
  }

  async register(userAgent: string, ipAddress: string, data: RegisterInput) {
    const response = await this.client.register(
      userAgent,
      ipAddress,
      data,
      'teststore',
    );
    if (response)
      this.logger.log(
        `User registered from agent: ${userAgent} with IP Address: ${ipAddress} using email: ${data.email}`,
      );
    return response;
  }

  async login(userAgent: string, ipAddress: string, data: LoginInput) {
    const response = await this.client.login(userAgent, ipAddress, data);
    if (response)
      this.logger.log(
        `User with email: ${data.email} Logged in from agent: ${userAgent} and IP Address: ${ipAddress}`,
      );
    return response;
  }

  async refreshToken(token: string) {
    return this.client.refreshToken(token);
  }

  logout(token: string) {
    return this.client.logout(token);
  }

  getClientToken(id: string, secret: string) {
    return this.client.getClientToken(id, secret);
  }
}
