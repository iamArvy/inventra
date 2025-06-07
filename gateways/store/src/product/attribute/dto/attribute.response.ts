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

  @Field(() => Date)
  @ApiProperty({ description: 'Unique identifier for the certification' })
  created_at: Date;

  @Field(() => Date)
  @ApiProperty({ description: 'Unique identifier for the certification' })
  updated_at: Date;
}
