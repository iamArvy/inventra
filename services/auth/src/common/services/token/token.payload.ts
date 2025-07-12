export class Payload {
  sub: string;
  type: string;
}
export class RefreshTokenPayload extends Payload {}

export class ResetPasswordPayload extends Payload {
  email: string;
}

export class EmailVerificationPayload extends Payload {
  email: string;
}

export class AccessTokenPayload extends Payload {
  storeId: string;
  emailVerified: string;
  role: string;
}
