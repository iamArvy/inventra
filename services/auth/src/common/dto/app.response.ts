// class TokenData {
//   @Field()
//   token: string;

//   @Field(() => Int)
//   expiresIn: number;
// }
// @ObjectType()
// export class ClientAuthResponse {
//   @Field(() => TokenData)
//   access: TokenData;
// }
export class Status {
  success: boolean;
}
