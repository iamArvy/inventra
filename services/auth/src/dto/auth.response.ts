class TokenData {
  token: string;
  expiresIn: number;
}

export class AuthResponse {
  access: TokenData;
  refresh: TokenData;
}
