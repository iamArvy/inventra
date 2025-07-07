import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  EmailData,
  IdInput,
  RequestPasswordResetMessage,
  ResetPasswordMessage,
  TokenInput,
  UpdatePasswordData,
  UserInput,
} from 'src/common/dto/app.inputs';
import { UserService } from './user.service';
import { CreateUserInput, DeleteUserInput } from './dto/user.inputs';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @GrpcMethod('UserService')
  health() {
    return { success: true };
  }

  @GrpcMethod('UserService')
  changePassword({ id, data }: UserInput<UpdatePasswordData>) {
    return this.service.updatePassword(id, data);
  }

  @GrpcMethod('UserService')
  changeEmail({ id, data }: UserInput<EmailData>) {
    return this.service.updateEmail(id, data.email);
  }

  @GrpcMethod('UserService')
  requestPasswordResetToken({ id, email }: RequestPasswordResetMessage) {
    return this.service.requestPasswordResetToken(id, email);
  }

  @GrpcMethod('UserService')
  resetPassword({ token, password }: ResetPasswordMessage) {
    return this.service.resetPassword(token, password);
  }

  @GrpcMethod('UserService')
  requestEmailVerification({ email }: EmailData) {
    return this.service.requestEmailVerification(email);
  }

  @GrpcMethod('UserService')
  verifyEmail({ token }: TokenInput) {
    return this.service.verifyEmail(token);
  }

  @GrpcMethod('UserService')
  list({ id }: IdInput) {
    return this.service.listStoreUsers(id);
  }

  @GrpcMethod('UserService')
  create({ id, data, roleId }: CreateUserInput) {
    return this.service.create(id, data, roleId);
  }

  @GrpcMethod('UserService')
  deactivate({ id, storeId }: DeleteUserInput) {
    return this.service.deactivate(id, storeId);
  }
}
