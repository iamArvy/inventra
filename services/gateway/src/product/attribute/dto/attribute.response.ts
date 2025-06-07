import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@ObjectType()
export class AttributeResponse {
  @Field(() => String)
  @ApiProperty({ type: String })
  key: string;

  @Field(() => String)
  @ApiProperty({ type: String })
  value: string;
}
