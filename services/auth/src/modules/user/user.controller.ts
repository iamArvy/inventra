import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UserService } from './user.service';
import {
  CreateUserInput,
  DeleteUserInput,
  RequestEmailVerificationInput,
  RequestPasswordResetMessage,
  ResetPasswordMessage,
  UpdateEmailInput,
  UpdatePasswordInput,
} from './user.inputs';
import { IdInput, TokenInput } from 'src/common/dto/app.inputs';
import { Status } from 'src/common/dto/app.response';
import { UserDto, UserList } from './user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @GrpcMethod('UserService')
  health(): Status {
    return { success: true };
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
    id,
    email,
  }: RequestPasswordResetMessage): Promise<Status> {
    return this.service.requestPasswordResetToken(id, email);
  }

  @GrpcMethod('UserService')
  resetPassword({ token, password }: ResetPasswordMessage): Promise<Status> {
    return this.service.resetPassword(token, password);
  }

  @GrpcMethod('UserService')
  requestEmailVerification({
    email,
  }: RequestEmailVerificationInput): Promise<Status> {
    return this.service.requestEmailVerification(email);
  }

  @GrpcMethod('UserService')
  verifyEmail({ token }: TokenInput): Promise<Status> {
    return this.service.verifyEmail(token);
  }

  @GrpcMethod('UserService')
  list({ id }: IdInput): Promise<UserList> {
    return this.service.listStoreUsers(id);
  }

  @GrpcMethod('UserService')
  create({ id, data, roleId }: CreateUserInput): Promise<UserDto> {
    return this.service.create(id, data, roleId);
  }

  @GrpcMethod('UserService')
  deactivate({ id, storeId }: DeleteUserInput): Promise<Status> {
    return this.service.deactivate(id, storeId);
  }
}
