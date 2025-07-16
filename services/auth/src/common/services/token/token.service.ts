import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenData } from 'src/modules/auth/auth.dto';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  private logger = new Logger('TokenService');

  private async generate<T extends object>(
    payload: T,
    expiresIn: number,
  ): Promise<TokenData> {
    const token = await this.jwtService.signAsync(payload, {
      expiresIn,
    });
    return { token, expiresIn };
  }

  async access(
    id: string,
    storeId: string,
    role: string,
    emailVerified: boolean,
  ): Promise<TokenData> {
    return await this.generate(
      { sub: id, type: 'access', storeId, emailVerified, role },
      15 * 60,
    );
  }
  async refresh(id: string): Promise<TokenData> {
    return await this.generate({ sub: id, type: 'refresh' }, 7 * 24 * 60 * 60);
  }

  async emailVerification(id: string, email: string): Promise<TokenData> {
    return await this.generate(
      { sub: id, email, type: 'email_verification' },
      15 * 60,
    );
  }

  async passwordReset(id: string, email: string): Promise<TokenData> {
    return await this.generate(
      { sub: id, email, type: 'password_reset' },
      15 * 60,
    );
  }

  async client(clientId: string): Promise<TokenData> {
    return await this.generate({ sub: clientId, type: 'client' }, 1 * 60 * 60);
  }

  async verify<T extends object>(token: string): Promise<T> {
    return this.jwtService.verifyAsync<T>(token);
  }
}
