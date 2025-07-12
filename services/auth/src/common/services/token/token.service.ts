import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  private logger = new Logger('TokenService');

  private async generateToken<T extends object>(
    payload: T,
    expiresIn: string,
  ): Promise<string> {
    const token = await this.jwtService.signAsync(payload, {
      expiresIn,
    });
    return token;
  }

  async generateAccessToken(
    id: string,
    storeId: string,
    emailVerified: boolean,
    role: string = 'user',
  ): Promise<string> {
    return await this.generateToken(
      { sub: id, type: 'access', storeId, emailVerified, role },
      '15m',
    );
  }
  async generateRefreshToken(id: string): Promise<string> {
    return await this.generateToken({ sub: id, type: 'refresh' }, '7d');
  }

  async generateEmailVerificationToken(
    id: string,
    email: string,
  ): Promise<string> {
    return await this.generateToken(
      { sub: id, email, type: 'email_verification' },
      '15m',
    );
  }

  async generatePasswordResetToken(id: string, email: string): Promise<string> {
    return await this.generateToken(
      { sub: id, email, type: 'password_reset' },
      '15m',
    );
  }

  async generateClientToken(clientId: string): Promise<string> {
    return await this.generateToken({ sub: clientId, type: 'client' }, '1h');
  }
  async verifyToken<T extends object>(token: string): Promise<T> {
    return this.jwtService.verifyAsync<T>(token);
  }

  async verifyEmailToken(token: string) {
    return await this.verifyToken<{
      sub: string;
      email: string;
    }>(token);
  }

  async verifyRefreshToken(token: string) {
    return await this.verifyToken<{
      sub: string;
      type: string;
    }>(token);
  }
}
