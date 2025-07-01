import { Inject, Injectable } from '@nestjs/common';
import {
  UpdateEmailInput,
  UpdatePasswordInput,
} from 'src/module/auth/dto/user/user.inputs';
import { ClientGrpc } from '@nestjs/microservices';
import {
  USER_SERVICE_NAME,
  UserServiceClient,
} from 'src/common/generated/auth';
import { AppService } from 'src/app.service';
import { User } from 'src/common/types';

@Injectable()
export class UserService extends AppService<UserServiceClient> {
  constructor(@Inject('auth') client: ClientGrpc) {
    super(client, USER_SERVICE_NAME);
  }

  async updatePassword({ id }: User, data: UpdatePasswordInput) {
    try {
      const response = await this.call(
        this.service.changePassword({
          id,
          data,
        }),
      );
      if (response.success) this.logger.log(`Password changed for user: ${id}`);
      return response;
    } catch (error) {
      this.handleError(error, `Error updating password for user: ${id}`);
    }
  }

  async updateEmail({ id }: User, data: UpdateEmailInput) {
    try {
      const response = await this.call(this.service.changeEmail({ id, data }));
      if (response.success) this.logger.log(`Email changed for user: ${id}`);
      return response;
    } catch (error) {
      this.handleError(error, `Error updating email for user: ${id}`);
    }
  }

  // @Delete(':id/delete')
  // deleteUser(@Req() req: { user: { id: string } }) {
  //   return this.userService.DeleteUser({ id: req.user.id });
  // }

  // @Post('create-admin')
  // async createAdmin(@Body() data: {} ) {}
}
