import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class CreateStoreInput {
  @ApiProperty()
  @Field(() => String)
  name: string;

  @ApiProperty()
  @Field(() => String)
  description?: string;

  @ApiProperty()
  @Field(() => String)
  location?: string;

  @ApiProperty()
  @Field(() => String)
  website?: string;

  @ApiProperty()
  @Field(() => String)
  phone?: string;

  @ApiProperty()
  @Field(() => String)
  email?: string;
}

@InputType()
export class UpdateStoreInput {
  @ApiProperty()
  @Field(() => String)
  name?: string;

  @ApiProperty()
  @Field(() => String)
  description?: string;

  @ApiProperty()
  @Field(() => String)
  location?: string;

  @ApiProperty()
  @Field(() => String)
  website?: string;

  @ApiProperty()
  @Field(() => String)
  phone?: string;

  @ApiProperty()
  @Field(() => String)
  email?: string;
}
