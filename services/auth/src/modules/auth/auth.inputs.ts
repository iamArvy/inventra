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
  name: string;
}

export class RegisterInput extends AuthInput<RegisterData> {
  storeId: string;
}

export class ClientTokenRequest {
  id: string;
  secret: string;
}
