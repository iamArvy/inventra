import { Injectable, Logger } from '@nestjs/common';
import { UpdateEmailInput, UpdatePasswordInput } from './user.inputs';
import { User } from 'src/common/types';
import { Cached } from 'src/common/decorators/cache.decorator';
import { CacheKeys } from 'src/cache/cache-keys';
import { UserClient } from '@grpc-clients/user';
import { CreateUserData, UpdateUserData } from '@common/proto/auth/user';

@Injectable()
export class UserService {
  constructor(private userClient: UserClient) {}
  private logger = new Logger(this.constructor.name);
  health() {
    return this.userClient.health();
  }

  async create(
    { id: actor_id }: User,
    id: string,
    data: CreateUserData,
    roleId: string,
  ) {
    const response = await this.userClient.create(id, data, roleId);
    if (response)
      this.logger.log(
        `User created in store: ${id} with role: ${id} by: ${actor_id}`,
      );
    return response;
  }

  @Cached('1h', (id: string) => CacheKeys.user(id))
  async get(id: string) {
    const response = await this.userClient.get(id);
    if (response) this.logger.log(`User gotten`);
    return response;
  }

  @Cached('1h', (id: string) => CacheKeys.storeUsers(id))
  async list(id: string) {
    const response = await this.userClient.list(id);
    if (response) this.logger.log(`User gotten`);
    return response;
  }

  async update(id: string, data: UpdateUserData) {
    const response = await this.userClient.update(id, data);
    if (response) this.logger.log(`User: ${id} data updated`);
    return response;
  }

  async updatePassword({ id }: User, data: UpdatePasswordInput) {
    const response = await this.userClient.changePassword(id, data);
    if (response.success) this.logger.log(`Password changed for user: ${id}`);
    return response;
  }

  async updateEmail({ id }: User, { email }: UpdateEmailInput) {
    const response = await this.userClient.changeEmail(id, email);
    if (response.success) this.logger.log(`Email changed for user: ${id}`);
    return response;
  }

  async requestEmailVerification({ id }: User) {
    const response = await this.userClient.requestEmailVerification(id);
    if (response.success) this.logger.log(`Email changed for user: ${id}`);
    return response;
  }

  async verifyEmail(token: string) {
    const response = await this.userClient.verifyEmail(token);
    if (response.success) this.logger.log(`Email verified`);
    return response;
  }

  async requestPasswordReset(
    email: string,
    userAgent: string,
    ipAddress: string,
  ) {
    const response = await this.userClient.requestPasswordResetToken(email);
    if (response.success)
      this.logger.log(
        `Password Reset requested by user with email: ${email} from agent: ${userAgent} with ip: ${ipAddress}`,
      );
    return response;
  }

  async resetPassword(token: string, password: string) {
    const response = await this.userClient.resetPassword(token, password);
    if (response.success) this.logger.log(`Password Reset`);
    return response;
  }

  async deactivate(id: string, storeId: string) {
    const response = await this.userClient.deactivate(id, storeId);
    if (response.success) this.logger.log(`Password Reset`);
    return response;
  }
}
