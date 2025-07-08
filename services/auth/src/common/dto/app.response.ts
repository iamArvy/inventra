// class TokenData {
//   @Field()
//   token: string;

//   @Field(() => Int)
//   expiresIn: number;
// }

// @ObjectType()
// export class AuthResponse {
//   @Field(() => TokenData)
//   access: TokenData;

//   @Field(() => TokenData)
//   refresh: TokenData;
// }

// @ObjectType()
// export class ClientAuthResponse {
//   @Field(() => TokenData)
//   access: TokenData;
// }
export class Status {
  success: boolean;
}
