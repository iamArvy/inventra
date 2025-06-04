import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { UserService } from 'src/user/user.service';
import { AuthResponse } from './dto/auth.response';
import { LoginInput, RegisterInput } from './dto/auth.inputs';

@Injectable()
export class AppService {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
    private user: UserService,
  ) {}

  async compareSecrets(hash: string, secret: string): Promise<boolean> {
    const valid = await argon.verify(hash, secret);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    return true;
  }

  private async generateToken(
    sub: string,
    type: 'refresh' | 'access',
    role: string,
  ): Promise<string> {
    const payload = { sub, role };
    const secret: string =
      this.config.get(type === 'refresh' ? 'REFRESH_SECRET' : 'JWT_SECRET') ||
      '';
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: type === 'refresh' ? '7d' : '15m',
      secret: secret,
    });
    return token;
  }

  async authenticateUser(id: string, role: string) {
    const access_token = await this.generateToken(id, 'access', role);
    const refresh_token = await this.generateToken(id, 'refresh', role);

    const hashedRefreshToken = await argon.hash(refresh_token);
    await this.user.updateRefreshToken(id, hashedRefreshToken);
    return {
      access: { token: access_token, expiresIn: 15000 },
      refresh: { token: refresh_token, expiresIn: 24000 },
    };
  }

  async refreshToken(refresh_token: string): Promise<AuthResponse> {
    const { sub }: { sub: string } = this.jwtService.verify(refresh_token, {
      secret: this.config.get('REFRESH_SECRET') || '',
    });

    const user = await this.user.findUserById(sub);
    if (!user || !user.refresh_token)
      throw new UnauthorizedException('Invalid refresh token');
    await this.compareSecrets(user.refresh_token, refresh_token);
    return this.authenticateUser(user.id, user.role?.role.name || 'user');
  }

  async login(data: LoginInput): Promise<AuthResponse> {
    const user = await this.user.findUserByEmail(data.email);
    if (!user) {
      throw new Error('User not found');
    }
    await this.compareSecrets(user.password, data.password);
    const role = user.role?.role.name ?? 'user';
    return this.authenticateUser(user.id, role);
  }

  async register(data: RegisterInput): Promise<AuthResponse> {
    const user = await this.user.createUser(data);
    return this.authenticateUser(user.id, 'user');
  }
  // async logout(id: string) {
  //   await this.user.updateRefreshToken(id, null);
  // }
}
