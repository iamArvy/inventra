import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@ObjectType()
export class CategoryResponse {
  @Field(() => String)
  @ApiProperty({ description: 'Unique identifier for the certification' })
  name: string;

  @Field(() => String)
  @ApiProperty({ description: 'Unique identifier for the certification' })
  description: string;

  @Field(() => String)
  @ApiProperty({ description: 'Unique identifier for the certification' })
  image: string;

  @Field(() => Date)
  @ApiProperty({ description: 'Unique identifier for the certification' })
  created_at: Date;

  @Field(() => Date)
  @ApiProperty({ description: 'Unique identifier for the certification' })
  updated_at: Date;
}
