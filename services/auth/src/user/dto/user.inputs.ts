export class UpdateEmailInput {
  id: string;
  email: string;
}

export class UpdatePasswordInput {
  id: string;
  oldPassword: string;
  newPassword: string;
}

export class CreateUserInput {
  email: string;
  password: string;
}
