// import { PartialType } from "@nestjs/mapped-types";

export class AuthInput<T> {
  data: T;
  userAgent: string;
  ipAddress: string;
}
export class LoginData {
  email: string;
  password: string;
}

export class RegisterData extends LoginData {
  userId: string;
}

export class RegisterInput extends AuthInput<RegisterData> {
  storeId: string;
}

export class UpdateEmailInput {
  email: string;
}

export class UserInput<T> {
  id: string;
  data: T;
}

export class UpdatePasswordData {
  newPassword: string;
  oldPassword: string;
}

export class EmailData {
  email: string;
}

export class TokenInput {
  token: string;
}

export class IdInput {
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
