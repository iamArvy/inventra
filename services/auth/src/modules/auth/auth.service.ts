import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SessionRepo } from 'src/db/repositories/session.repo';
import { UserRepo } from 'src/db/repositories/user.repo';
import { Status } from 'src/common/dto/app.response';
import { TokenService } from 'src/common/services/token/token.service';
import { SecretService } from 'src/common/services/secret/secret.service';
import { LoginData, RegisterData } from './auth.inputs';
import { AuthResponse } from './auth.response';
import { BaseService } from 'src/common/services/base/base.service';
import { UserEvent } from 'src/messaging/event/user.event';
import { RoleRepo } from 'src/db/repositories/role.repo';
import { ClientRepo } from 'src/db/repositories/client.repo';
import { UserDto } from '../user/user.dto';

@Injectable()
export class AuthService extends BaseService {
  constructor(
    private userRepo: UserRepo,
    private sessionRepo: SessionRepo,
    private tokenService: TokenService,
    private secret: SecretService,
    private userEvent: UserEvent,
    private roleRepo: RoleRepo,
    private clientRepo: ClientRepo,
  ) {
    super();
  }

  private async issueTokens(
    sessionId: string,
    userId: string,
    storeId: string,
    emailVerified: boolean = false,
  ): Promise<AuthResponse> {
    const refreshToken =
      await this.tokenService.generateRefreshToken(sessionId);
    const accessToken = await this.tokenService.generateAccessToken(
      userId,
      storeId,
      emailVerified,
    );
    const hashed = await this.secret.create(refreshToken);
    await this.sessionRepo.updateRefreshToken(sessionId, hashed);

    return {
      access: {
        token: accessToken,
        expiresIn: 15 * 60 * 1000,
      },
      refresh: {
        token: refreshToken,
        expiresIn: 7 * 24 * 60 * 60 * 1000,
      },
    };
  }

  private async authenticateUser(
    id: string,
    userAgent: string,
    ipAddress: string,
    newUser: boolean = false,
    storeId: string,
    emailVerified: boolean = false,
  ): Promise<AuthResponse> {
    try {
      const existingSession = await this.sessionRepo.findByUserIdAndDevice(
        id,
        userAgent,
        ipAddress,
      );

      if (existingSession) {
        return this.issueTokens(existingSession.id, id, storeId, emailVerified);
      }

      const session = await this.sessionRepo.create({
        user: { connect: { id } },
        userAgent,
        ipAddress,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      if (!newUser) {
        this.userEvent.newDeviceLogin({
          userId: id,
          userAgent,
          ipAddress,
        });
      }
      return this.issueTokens(session.id, id, storeId, emailVerified);
    } catch (error) {
      this.handleError(error, 'AuthService.authenticateUser');
    }
  }

  async signup(
    storeId: string,
    data: RegisterData,
    userAgent: string,
    ipAddress: string,
  ): Promise<AuthResponse> {
    try {
      if (!data) throw new UnauthorizedException('Invalid credentials');
      const exists = await this.userRepo.findByEmail(data.email);
      if (exists) throw new UnauthorizedException('User already exists');
      const hash = await this.secret.create(data.password);
      const role = await this.roleRepo.createOwner(storeId);
      if (!role) throw new UnauthorizedException('Role creation failed');
      const user = await this.userRepo.create({
        ...data,
        passwordHash: hash,
        storeId,
        role: { connect: { id: role.id } },
      });

      if (!user) throw new UnauthorizedException('User creation failed');

      const pUser = new UserDto(user);
      this.userEvent.created(pUser);

      const token = await this.tokenService.generateEmailVerificationToken(
        user.id,
        user.email,
      );

      this.userEvent.emailVerificationRequested({
        token,
        email: user.email,
      });

      return this.authenticateUser(
        user.id,
        userAgent,
        ipAddress,
        true,
        storeId,
        false,
      );
    } catch (error) {
      this.handleError(error, 'AuthService.signup');
    }
  }

  async login(
    data: LoginData,
    userAgent: string,
    ipAddress: string,
  ): Promise<AuthResponse> {
    try {
      const user = await this.userRepo.findByEmail(data.email);
      if (!user) throw new UnauthorizedException('User not found');
      await this.secret.compare(user.passwordHash, data.password);
      return this.authenticateUser(
        user.id,
        userAgent,
        ipAddress,
        false,
        user.storeId,
        user.emailVerified,
      );
    } catch (error) {
      this.handleError(error, 'AuthService.login');
    }
  }

  private async verifyRefreshToken(refresh_token: string): Promise<string> {
    const { sub: id } =
      await this.tokenService.verifyRefreshToken(refresh_token);
    const session = await this.sessionRepo.findById(id);
    if (!session || session.revokedAt) {
      throw new UnauthorizedException('Session not found or revoked');
    }
    if (session.expiresAt < new Date()) {
      throw new UnauthorizedException('Session expired');
    }

    // Check if the session's hashed refresh token matches the provided refresh token
    if (!session.hashedRefreshToken)
      throw new UnauthorizedException('Session has no refresh token');

    await this.secret.compare(session.hashedRefreshToken, refresh_token);
    return session.id;
  }

  async refreshToken(
    refresh_token: string,
  ): Promise<{ token: string; expiresIn: number }> {
    try {
      const sessionId = await this.verifyRefreshToken(refresh_token);
      const user = await this.userRepo.findById(sessionId);
      if (!user) throw new NotFoundException('User not found');
      // Generate new tokens
      const accessToken = await this.tokenService.generateAccessToken(
        user.id,
        user.storeId,
        user.emailVerified,
        user.roleId,
      );
      return { token: accessToken, expiresIn: 60 * 15 * 1000 };
    } catch (error) {
      this.handleError(error, 'AuthService.refreshToken');
    }
  }

  async logout(token: string): Promise<Status> {
    try {
      const sessionId = await this.verifyRefreshToken(token);
      await this.sessionRepo.update(sessionId, {
        hashedRefreshToken: null,
        expiresAt: new Date(),
        revokedAt: new Date(),
      });
      return { success: true };
    } catch (error) {
      this.handleError(error, 'AuthService.logout');
    }
  }

  async getClientToken(id: string, secret: string): Promise<string> {
    try {
      const client = await this.clientRepo.findById(id);
      if (!client) throw new NotFoundException('Client not found');
      await this.secret.compare(client.hashedSecret, secret);
      const token = await this.tokenService.generateClientToken(client.id);
      return token;
    } catch (error) {
      this.handleError(error, 'AuthService.getClientToken');
    }
  }
}
