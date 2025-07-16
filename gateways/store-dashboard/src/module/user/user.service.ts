import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { AppService } from 'src/app.service';
import {
  CreateUserData,
  UpdateUserData,
  USER_SERVICE_NAME,
  UserServiceClient,
} from 'src/common/proto/auth/user';
import { UpdateEmailInput, UpdatePasswordInput } from './user.inputs';
import { User } from 'src/common/types';
import { Cached } from 'src/common/decorators/cache.decorator';
import { CacheKeys } from 'src/cache/cache-keys';

@Injectable()
export class UserService extends AppService<UserServiceClient> {
  constructor(@Inject('auth') client: ClientGrpc) {
    super(client, USER_SERVICE_NAME);
  }

  health() {
    return this.service.health({});
  }

  async create(
    { id: actor_id }: User,
    id: string,
    data: CreateUserData,
    roleId: string,
  ) {
    const response = await this.call(this.service.create({ id, data, roleId }));
    if (response)
      this.logger.log(
        `User created in store: ${id} with role: ${id} by: ${actor_id}`,
      );
    return response;
  }

  @Cached('1h', (id: string) => CacheKeys.user(id))
  async get(id: string) {
    const response = await this.call(this.service.get({ id }));
    if (response) this.logger.log(`User gotten`);
    return response;
  }

  @Cached('1h', (id: string) => CacheKeys.storeUsers(id))
  async list(id: string) {
    const response = await this.call(this.service.list({ id }));
    if (response) this.logger.log(`User gotten`);
    return response;
  }

  async update(id: string, data: UpdateUserData) {
    const response = await this.call(this.service.update({ id, data }));
    if (response) this.logger.log(`User: ${id} data updated`);
    return response;
  }

  async updatePassword({ id }: User, data: UpdatePasswordInput) {
    const response = await this.call(
      this.service.changePassword({
        id,
        data,
      }),
    );
    if (response.success) this.logger.log(`Password changed for user: ${id}`);
    return response;
  }

  async updateEmail({ id }: User, { email }: UpdateEmailInput) {
    const response = await this.call(this.service.changeEmail({ id, email }));
    if (response.success) this.logger.log(`Email changed for user: ${id}`);
    return response;
  }

  async requestEmailVerification({ id }: User) {
    const response = await this.call(
      this.service.requestEmailVerification({ id }),
    );
    if (response.success) this.logger.log(`Email changed for user: ${id}`);
    return response;
  }

  async verifyEmail(token: string) {
    const response = await this.call(this.service.verifyEmail({ token }));
    if (response.success) this.logger.log(`Email verified`);
    return response;
  }

  async requestPasswordReset(
    email: string,
    userAgent: string,
    ipAddress: string,
  ) {
    const response = await this.call(
      this.service.requestPasswordResetToken({ email }),
    );
    if (response.success)
      this.logger.log(
        `Password Reset requested by user with email: ${email} from agent: ${userAgent} with ip: ${ipAddress}`,
      );
    return response;
  }

  async resetPassword(token: string, password: string) {
    const response = await this.call(
      this.service.resetPassword({ token, password }),
    );
    if (response.success) this.logger.log(`Password Reset`);
    return response;
  }

  async deactivate(id: string, storeId: string) {
    const response = await this.call(this.service.deactivate({ id, storeId }));
    if (response.success) this.logger.log(`Password Reset`);
    return response;
  }
}
