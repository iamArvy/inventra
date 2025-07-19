import { Status } from '@common/proto/auth/common';
import {
  CreateUserData,
  UpdateUserData,
  USER_SERVICE_NAME,
  UserServiceClient,
  ChangePasswordData,
  User,
  UserList,
} from '@common/proto/auth/user';
import { BaseClient } from '@grpc-clients/base.client';
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class UserClient extends BaseClient<UserServiceClient> {
  constructor(@Inject('auth') client: ClientGrpc) {
    super(client, USER_SERVICE_NAME);
  }

  health(): Observable<Status> {
    return this.service.health({});
  }
  create(id: string, data: CreateUserData, roleId: string): Promise<User> {
    return this.call(this.service.create({ id, data, roleId }));
  }

  get(id: string): Promise<User> {
    return this.call(this.service.get({ id }));
  }

  list(id: string): Promise<UserList> {
    return this.call(this.service.list({ id }));
  }

  update(id: string, data: UpdateUserData): Promise<Status> {
    return this.call(this.service.update({ id, data }));
  }

  changePassword(id: string, data: ChangePasswordData): Promise<Status> {
    return this.call(
      this.service.changePassword({
        id,
        data,
      }),
    );
  }

  changeEmail(id: string, email: string): Promise<Status> {
    return this.call(this.service.changeEmail({ id, email }));
  }

  requestEmailVerification(id: string): Promise<Status> {
    return this.call(this.service.requestEmailVerification({ id }));
  }

  verifyEmail(token: string): Promise<Status> {
    return this.call(this.service.verifyEmail({ token }));
  }

  requestPasswordResetToken(email: string): Promise<Status> {
    return this.call(this.service.requestPasswordResetToken({ email }));
  }

  resetPassword(token: string, password: string): Promise<Status> {
    return this.call(this.service.resetPassword({ token, password }));
  }

  deactivate(id: string, storeId: string): Promise<Status> {
    return this.call(this.service.deactivate({ id, storeId }));
  }
}
