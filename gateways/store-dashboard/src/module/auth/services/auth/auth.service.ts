import { Inject, Injectable } from '@nestjs/common';
import {
  LoginInput,
  RegisterInput,
} from 'src/module/auth/dto/auth/auth.inputs';
import { ClientGrpc } from '@nestjs/microservices';
import { AUTH_SERVICE_NAME, AuthServiceClient } from 'src/common/proto/auth';
import { AppService } from 'src/app.service';

@Injectable()
export class AuthService extends AppService<AuthServiceClient> {
  constructor(@Inject('auth') client: ClientGrpc) {
    super(client, AUTH_SERVICE_NAME);
  }

  health() {
    try {
      return this.service.health({});
    } catch (error) {
      this.handleError(error, 'Health check Failed');
    }
  }

  async register(userAgent: string, ipAddress: string, data: RegisterInput) {
    try {
      const response = await this.call(
        this.service.register({ userAgent, ipAddress, data }),
      );
      if (response)
        this.logger.log(
          `User registered from agent: ${userAgent} with IP Address: ${ipAddress} using email: ${data.email}`,
        );
      return response;
    } catch (error) {
      this.handleError(
        error,
        `Registration failed from userAgent: ${userAgent} with IP Address: ${ipAddress}`,
      );
    }
  }

  async login(userAgent: string, ipAddress: string, data: LoginInput) {
    try {
      const response = await this.call(
        this.service.login({ userAgent, ipAddress, data }),
      );
      if (response)
        this.logger.log(
          `User with email: ${data.email} Logged in from agent: ${userAgent} and IP Address: ${ipAddress}`,
        );
      return response;
    } catch (error) {
      this.handleError(
        error,
        `Login failed for User with email: ${data.email} from agent: ${userAgent} with IP Address: ${ipAddress}`,
      );
    }
  }
}
