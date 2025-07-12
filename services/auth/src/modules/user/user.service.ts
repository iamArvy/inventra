import { RoleRepo } from 'src/db/repositories/role.repo';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from 'src/common/services/token/token.service';
import { UserRepo } from 'src/db/repositories/user.repo';
import { SecretService } from 'src/common/services/secret/secret.service';
import { Status } from 'src/common/dto/app.response';
import { UserEvent } from 'src/messaging/event/user.event';
import { randomBytes } from 'crypto';
import { UpdatePasswordData, UserData } from './user.inputs';
import { UserDto, UserList } from './user.dto';
import { CacheKeys } from 'src/cache/cache-keys';
import { CacheService } from 'src/cache/cache.service';
import { Cached } from 'src/common/decorators/cache.decorator';

@Injectable()
export class UserService {
  constructor(
    private repo: UserRepo,
    private tokenService: TokenService,
    private secret: SecretService,
    private event: UserEvent, // Assuming this is imported correctly
    private roleRepo: RoleRepo,
    private cache: CacheService,
  ) {}

  protected readonly logger = new Logger(this.constructor.name);

  async updatePassword(id: string, data: UpdatePasswordData): Promise<Status> {
    const user = await this.repo.findById(id);
    if (!user) throw new NotFoundException('User not found');
    await this.secret.compare(user.passwordHash, data.oldPassword);
    const hash = await this.secret.create(data.newPassword);
    await this.repo.updatePassword(id, hash);
    this.logger.log(`Password updated for user ${id}`);
    return { success: true };
  }

  async updateEmail(id: string, email: string): Promise<Status> {
    const user = await this.repo.findById(id);
    if (!user) throw new UnauthorizedException('User not Found');
    await this.repo.updateEmail(id, email);
    await this.repo.updateEmailVerified(id, false);
    this.event.updated({
      userId: id,
      email,
    });
    this.logger.log(`Email updated for user ${id}`);
    return { success: true };
  }

  async requestEmailVerification(email: string): Promise<Status> {
    const user = await this.repo.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    if (user.emailVerified)
      throw new UnauthorizedException('Email already verified');
    const token = await this.tokenService.generateEmailVerificationToken(
      user.id,
      email,
    );

    this.event.emailVerificationRequested({
      token,
      email,
    });
    this.logger.log(`Email verification requested for user ${user.id}`);
    return { success: true };
  }

  async verifyEmail(token: string): Promise<Status> {
    const { sub, email }: { sub: string; email: string } =
      await this.tokenService.verifyEmailToken(token);
    const user = await this.repo.findById(sub);
    if (!user) throw new NotFoundException('User not found');
    if (user.email !== email)
      throw new BadRequestException(
        'Email from token does not match user email',
      );
    await this.repo.updateEmailVerified(sub, true);
    this.event.emailVerified({
      userId: sub,
      email,
    });
    this.logger.log(`Email verified for user ${sub}`);
    return { success: true };
  }

  async requestPasswordResetToken(
    userId: string,
    email: string,
  ): Promise<Status> {
    const user = await this.repo.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    if (user.email !== email)
      throw new UnauthorizedException('User Email mismatched');
    const token = await this.tokenService.generatePasswordResetToken(
      user.id,
      user.email,
    );
    this.event.passwordResetRequested({
      token,
      email,
    });
    this.logger.log(`Password reset token requested for user ${user.id}`);
    return { success: true };
  }

  async resetPassword(token: string, password: string): Promise<Status> {
    const { sub, email }: { sub: string; email: string } =
      await this.tokenService.verifyEmailToken(token);
    const user = await this.repo.findById(sub);
    if (!user) throw new NotFoundException('User not found');
    if (user.email !== email)
      throw new UnauthorizedException('User Email mismatched');
    const hash = await this.secret.create(password);
    await this.repo.updatePassword(user.id, hash);
    this.logger.log(`Password reset for user ${user.id}`);
    return { success: true };
  }

  @Cached<UserList>('1h', (id: string) => CacheKeys.storeUsers(id))
  async listStoreUsers(id: string): Promise<UserList> {
    const users = await this.repo.listByStore(id);
    return { users };
  }

  async create(
    storeId: string,
    data: UserData,
    roleId: string,
  ): Promise<UserDto> {
    const exists = await this.repo.findByEmail(data.email);
    if (exists)
      throw new BadRequestException(`User with this email already exists`);
    const role = await this.roleRepo.findById(roleId);
    if (!role || role.storeId !== storeId)
      throw new BadRequestException('Role does not exist in store');
    const passwordHash = randomBytes(32).toString('hex');
    const user = await this.repo.create({
      ...data,
      passwordHash,
      storeId,
      role: { connect: { id: role.id } },
    });
    if (!user)
      throw new InternalServerErrorException(`User not created successfully`);
    const pUser = new UserDto(user);
    this.event.created(pUser);
    this.logger.log(
      `New user: ${user.id} created in store: ${storeId} with role ${role.id}`,
    );
    return pUser;
  }

  @Cached<UserDto>('1h', (id: string) => CacheKeys.user(id))
  async get(id: string): Promise<UserDto> {
    const user = await this.repo.findById(id);
    if (!user) throw new NotFoundException();
    return new UserDto(user);
  }

  async deactivate(id: string, storeId: string) {
    const user = await this.repo.findById(id);
    if (!user || user.storeId !== storeId)
      throw new NotFoundException('User not found');
    await this.repo.deactivate(id);
    this.logger.log(`User: ${id} deactivated successfully.`);
    await this.cache.delete(CacheKeys.user(id));
    await this.cache.delete(CacheKeys.storeUsers(user.storeId));
    this.event.deactivated(id);
    return { success: true };
  }
}
