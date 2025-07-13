import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UserService } from './user.service';
import {
  CreateUserInput,
  DeleteUserInput,
  RequestPasswordResetMessage,
  ResetPasswordMessage,
  UpdateEmailInput,
  UpdatePasswordInput,
  UpdateUserInput,
} from './user.inputs';
import { IdInput, TokenInput } from 'src/common/dto/app.inputs';
import { Status } from 'src/common/dto/app.response';
import { UserDto, UserList } from './user.dto';
import { GetById } from 'src/common/decorators/get-by-id.decorator';
import { UserPipe } from 'src/common/pipes/user.pipe';
import { User } from 'generated/prisma';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @GrpcMethod('UserService')
  health(): Status {
    return { success: true };
  }

  @GrpcMethod('UserService')
  create({ id, data, roleId }: CreateUserInput): Promise<UserDto> {
    return this.service.create(id, data, roleId);
  }

  @GrpcMethod('UserService')
  list({ id }: IdInput): Promise<UserList> {
    return this.service.listStoreUsers(id);
  }

  @GrpcMethod('UserService')
  get(@GetById('id', UserPipe) user: User): Promise<UserDto> {
    console.log(user);
    return this.service.get(user.id);
  }

  @GrpcMethod('UserService')
  update({ id, data }: UpdateUserInput): Promise<Status> {
    return this.service.update(id, data);
  }

  @GrpcMethod('UserService')
  changePassword({ id, data }: UpdatePasswordInput): Promise<Status> {
    return this.service.updatePassword(id, data);
  }

  @GrpcMethod('UserService')
  changeEmail({ id, email }: UpdateEmailInput): Promise<Status> {
    return this.service.updateEmail(id, email);
  }

  @GrpcMethod('UserService')
  requestPasswordResetToken({
    email,
  }: RequestPasswordResetMessage): Promise<Status> {
    return this.service.requestPasswordResetToken(email);
  }

  @GrpcMethod('UserService')
  resetPassword({ token, password }: ResetPasswordMessage): Promise<Status> {
    return this.service.resetPassword(token, password);
  }

  @GrpcMethod('UserService')
  requestEmailVerification({ id }: IdInput): Promise<Status> {
    return this.service.requestEmailVerification(id);
  }

  @GrpcMethod('UserService')
  verifyEmail({ token }: TokenInput): Promise<Status> {
    return this.service.verifyEmail(token);
  }

  @GrpcMethod('UserService')
  deactivate({ id, storeId }: DeleteUserInput): Promise<Status> {
    return this.service.deactivate(id, storeId);
  }
}
