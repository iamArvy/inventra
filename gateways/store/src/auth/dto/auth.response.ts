// class TokenData {
//   @Field()
//   token: string;

import { ApiProperty } from '@nestjs/swagger';

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

class TokenData {
  @ApiProperty({ type: String })
  token: string;

  @ApiProperty({ type: Number })
  expiresIn: number;
}

export class AuthResponse {
  @ApiProperty({ type: TokenData })
  access: TokenData;

  @ApiProperty({ type: TokenData })
  refresh: TokenData;
}
