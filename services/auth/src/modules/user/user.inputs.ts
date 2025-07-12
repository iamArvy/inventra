import { EmailInput, IdDataInput } from 'src/common/dto/app.inputs';
export class UserData {
  name: string;
  email: string;
}
export class CreateUserInput {
  id: string;
  data: UserData;
  roleId: string;
}

export class UpdateUserInfo {
  name?: string;
}

export class UpdateUserInput {
  id: string;
  data: UpdateUserInfo;
}

export class DeleteUserInput {
  id: string;
  storeId: string;
}

export class UpdatePasswordData {
  newPassword: string;
  oldPassword: string;
}

export class UpdatePasswordInput extends IdDataInput<UpdatePasswordData> {}

export class UpdateEmailInput extends EmailInput {
  id: string;
}

export class RequestPasswordResetMessage {
  id: string;
  email: string;
}

export class ResetPasswordMessage {
  token: string;
  password: string;
}

export class RequestEmailVerificationInput extends EmailInput {}
