import { Injectable, Logger } from '@nestjs/common';
import {
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  UnauthorizedException,
} from 'src/common/helpers/grpc-exception';
import { Status } from 'src/common/dto/app.response';
import { TokenService } from 'src/common/services/token/token.service';
import { SecretService } from 'src/common/services/secret/secret.service';
import { LoginData, RegisterData } from './auth.inputs';
import { AuthResponse } from './auth.dto';
import { UserEvent } from 'src/messaging/event/user.event';
import { RoleRepo, ClientRepo, UserRepo, SessionRepo } from 'src/db/repository';
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
    roleId: string,
    emailVerified: boolean = false,
  ): Promise<AuthResponse> {
    const refresh = await this.token.refresh(sessionId);
    const access = await this.token.access(
      userId,
      storeId,
      roleId,
      emailVerified,
    );
    const hashed = await this.secret.create(refresh.token);
    await this.sessionRepo.updateRefreshToken(sessionId, hashed);

    return {
      access,
      refresh,
    };
  }

  async signup(
    storeId: string,
    data: RegisterData,
    userAgent: string,
    ipAddress: string,
  ): Promise<AuthResponse> {
    if (!storeId || !data || !userAgent || !ipAddress)
      throw new BadRequestException('Invalid credentials');
    const uExists = await this.userRepo.findByEmail(data.email);
    if (uExists) throw new BadRequestException('User already exists');
    const rExists = await this.roleRepo.findRoleByNameAndStore(
      storeId,
      'owner',
    );
    if (rExists) throw new BadRequestException('Role Already Exists in store');
    const hash = await this.secret.create(data.password);
    const role = await this.roleRepo.createOwner(storeId);
    if (!role) throw new InternalServerErrorException();
    const user = await this.userRepo.create({
      ...data,
      passwordHash: hash,
      storeId,
      role: { connect: { id: role.id } },
    });

    if (!user) throw new InternalServerErrorException();

    const pUser = new UserDto(user);
    this.userEvent.created(pUser);

    const token = await this.token.emailVerification(user.id, user.email);

    this.userEvent.emailVerificationRequested({
      token: token.token,
      email: user.email,
    });

    const session = await this.sessionRepo.create({
      user: { connect: { id: user.id } },
      userAgent,
      ipAddress,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return this.issueTokens(
      session.id,
      user.id,
      storeId,
      user.roleId,
      user.emailVerified,
    );
  }

  async login(
    data: LoginData,
    userAgent: string,
    ipAddress: string,
  ): Promise<AuthResponse> {
    const user = await this.userRepo.findByEmail(data.email);
    if (!user) throw new UnauthorizedException('User not found');
    const { id, storeId, emailVerified, roleId } = user;
    await this.secret.compare(user.passwordHash, data.password);
    const existingSession = await this.sessionRepo.findByUserIdAndDevice(
      id,
      userAgent,
      ipAddress,
    );

    if (existingSession) {
      return this.issueTokens(
        existingSession.id,
        id,
        storeId,
        roleId,
        emailVerified,
      );
    }

    const session = await this.sessionRepo.create({
      user: { connect: { id } },
      userAgent,
      ipAddress,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    this.userEvent.newDeviceLogin({
      id,
      userAgent,
      ipAddress,
    });
    return this.issueTokens(session.id, id, storeId, roleId, emailVerified);
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
    return session.userId;
  }

  async refreshToken(refresh_token: string): Promise<TokenData> {
    const userId = await this.verifyRefreshToken(refresh_token);
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    // Generate new tokens
    const access = await this.token.access(
      user.id,
      user.storeId,
      user.roleId,
      user.emailVerified,
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
