import { RoleRepo } from 'src/db/repositories/role.repo';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from 'src/common/token/token.service';
import { UserRepo } from 'src/db/repositories/user.repo';
import { SecretService } from 'src/common/secret/secret.service';
import { UpdatePasswordData } from 'src/common/dto/app.inputs';
import { Status } from 'src/common/dto/app.response';
import { BaseService } from 'src/common/base/base.service';
import { UserEvent } from 'src/messaging/event/user.event';
import { randomBytes } from 'crypto';
import { UserData } from './dto/user.inputs';
import { UserDto } from './dto/user.dto';
import { CacheKeys } from 'src/cache/cache-keys';

@Injectable()
export class UserService extends BaseService {
  constructor(
    private repo: UserRepo,
    private tokenService: TokenService,
    private secret: SecretService,
    private event: UserEvent, // Assuming this is imported correctly
    private roleRepo: RoleRepo,
  ) {
    super();
  }

  async updatePassword(id: string, data: UpdatePasswordData): Promise<Status> {
    try {
      const user = await this.repo.findById(id);
      if (!user) throw new NotFoundException('User not found');
      await this.secret.compare(user.passwordHash, data.oldPassword);
      const hash = await this.secret.create(data.newPassword);
      await this.repo.updatePassword(id, hash);
      this.logger.log(`Password updated for user ${id}`);
      return { success: true };
    } catch (error) {
      this.handleError(error, 'UserService.updatePassword');
    }
  }

  async updateEmail(id: string, email: string): Promise<Status> {
    try {
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
    } catch (error) {
      this.handleError(error, 'UserService.updateEmail');
    }
  }

  async requestEmailVerification(email: string): Promise<Status> {
    try {
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
    } catch (error) {
      this.handleError(error, 'UserService.requestEmailVerification');
    }
  }

  async verifyEmail(token: string): Promise<Status> {
    try {
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
    } catch (error) {
      this.handleError(error, 'UserService.verifyEmail');
    }
  }

  async requestPasswordResetToken(
    userId: string,
    email: string,
  ): Promise<Status> {
    try {
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
    } catch (error) {
      this.handleError(error, 'UserService.requestPasswordResetToken');
    }
  }

  async resetPassword(token: string, password: string): Promise<Status> {
    try {
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
    } catch (error) {
      this.handleError(error, 'UserService.resetPassword');
    }
  }

  async listStoreUsers(id: string) {
    try {
      const users = await this.repo.listByStore(id);
      return { users };
    } catch (error) {
      this.handleError(error, 'UserService.listStoreUsers');
    }
  }

  async create(storeId: string, data: UserData, roleId: string) {
    try {
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
      return { success: true };
    } catch (error) {
      this.handleError(error, `UserService.create`);
    }
  }

  async get(id: string) {
    try {
      const cachedUser = await this.cache.get<UserDto>(CacheKeys.user(id));
      if (cachedUser) {
        this.logger.log('User Returned from Cache');
        return cachedUser;
      }
    } catch (error) {
      this.handleError(error, 'UserService.get');
    }
  }

  async deactivate(id: string, storeId: string) {
    try {
      const user = await this.repo.findById(id);
      if (!user || user.storeId !== storeId)
        throw new NotFoundException('User not found');
      await this.repo.deactivate(id);
      this.logger.log(`User: ${id} deactivated successfully.`);
      await this.cache.delete(CacheKeys.user(id));
      await this.cache.delete(CacheKeys.storeUsers(user.storeId));
      this.event.deactivated(id);
    } catch (error) {
      this.handleError(error, `UserService.delete`);
    }
  }
}
