import {
  Injectable,
  Logger,
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
import { UserEvent } from 'src/messaging/event/user.event';
import { RoleRepo } from 'src/db/repositories/role.repo';
import { ClientRepo } from 'src/db/repositories/client.repo';
import { UserDto } from '../user/user.dto';
import { TokenData } from './auth.dto';
import { RefreshTokenPayload } from 'src/common/services/token/token.payload';

@Injectable()
export class AuthService {
  constructor(
    private userRepo: UserRepo,
    private sessionRepo: SessionRepo,
    private token: TokenService,
    private secret: SecretService,
    private userEvent: UserEvent,
    private roleRepo: RoleRepo,
    private clientRepo: ClientRepo,
  ) {}

  protected readonly logger = new Logger(this.constructor.name);

  private async issueTokens(
    sessionId: string,
    userId: string,
    storeId: string,
    emailVerified: boolean = false,
  ): Promise<AuthResponse> {
    const refresh = await this.token.refresh(sessionId);
    const access = await this.token.access(userId, storeId, emailVerified);
    const hashed = await this.secret.create(refresh.token);
    await this.sessionRepo.updateRefreshToken(sessionId, hashed);

    return {
      access,
      refresh,
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
  }

  async signup(
    storeId: string,
    data: RegisterData,
    userAgent: string,
    ipAddress: string,
  ): Promise<AuthResponse> {
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

    const token = await this.token.emailVerification(user.id, user.email);

    this.userEvent.emailVerificationRequested({
      token: token.token,
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
  }

  async login(
    data: LoginData,
    userAgent: string,
    ipAddress: string,
  ): Promise<AuthResponse> {
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
  }

  private async verifyRefreshToken(refresh_token: string): Promise<string> {
    const { sub: id } =
      await this.token.verify<RefreshTokenPayload>(refresh_token);
    const session = await this.sessionRepo.findById(id);
    if (!session || session.revokedAt) {
      throw new UnauthorizedException('Session not found or revoked');
    }
    if (session.expiresAt < new Date()) {
      throw new UnauthorizedException('Session expired');
    }
    if (!session.hashedRefreshToken)
      throw new UnauthorizedException('Session has no refresh token');

    await this.secret.compare(session.hashedRefreshToken, refresh_token);
    return session.id;
  }

  async refreshToken(refresh_token: string): Promise<TokenData> {
    const sessionId = await this.verifyRefreshToken(refresh_token);
    const user = await this.userRepo.findById(sessionId);
    if (!user) throw new NotFoundException('User not found');
    // Generate new tokens
    const access = await this.token.access(
      user.id,
      user.storeId,
      user.emailVerified,
      user.roleId,
    );
    return access;
  }

  async logout(token: string): Promise<Status> {
    const sessionId = await this.verifyRefreshToken(token);
    await this.sessionRepo.update(sessionId, {
      hashedRefreshToken: null,
      expiresAt: new Date(),
      revokedAt: new Date(),
    });
    return { success: true };
  }

  async getClientToken(id: string, secret: string): Promise<TokenData> {
    const client = await this.clientRepo.findById(id);
    if (!client) throw new NotFoundException('Client not found');
    await this.secret.compare(client.hashedSecret, secret);
    const token = await this.token.client(client.id);
    return token;
  }
}
