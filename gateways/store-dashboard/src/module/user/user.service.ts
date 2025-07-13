import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { AppService } from 'src/app.service';
import {
  USER_SERVICE_NAME,
  UserServiceClient,
} from 'src/common/proto/auth/user';
import { UpdateEmailInput, UpdatePasswordInput } from './user.inputs';
import { User } from 'src/common/types';

@Injectable()
export class UserService extends AppService<UserServiceClient> {
  constructor(@Inject('auth') client: ClientGrpc) {
    super(client, USER_SERVICE_NAME);
  }

  health() {
    return this.service.health({});
  }

  async get(id: string) {
    const response = await this.call(this.service.get({ id }));
    if (response) this.logger.log(`User gotten`);
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

  async updateEmail({ id }: User, data: UpdateEmailInput) {
    const response = await this.call(
      this.service.changeEmail({ id, email: data.email }),
    );
    if (response.success) this.logger.log(`Email changed for user: ${id}`);
    return response;
  }
}
