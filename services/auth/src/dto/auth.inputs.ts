export class RegisterInput {
  email: string;
  password: string;
}

export class LoginInput {
  email: string;
  password: string;
}

// export class UpdateEmailInput {
//   @IsEmail()
//   @IsNotEmpty()
//   email: string;
// }

// export class UpdatePasswordInput {
//   @IsNotEmpty()
//   @IsString()
//   oldPassword: string;

//   @IsNotEmpty()
//   @IsStrongPassword()
//   newPassword: string;
// }
