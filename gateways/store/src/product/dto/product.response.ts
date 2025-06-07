import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { VariantResponse } from '../variant/dto';

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

@ObjectType()
export class ProductResponse {
  @Field(() => String)
  @ApiProperty({ description: 'Unique identifier for the certification' })
  name: string;

  @Field(() => String)
  @ApiProperty({ description: 'Unique identifier for the certification' })
  description: string;

  // @Field(() => Object)
  @ApiProperty({ description: 'Unique identifier for the certification' })
  store: {
    id: string;
    name: string;
  };

  @Field(() => CategoryResponse)
  @ApiProperty({
    type: CategoryResponse,
    description: 'Unique identifier for the certification',
  })
  category: CategoryResponse;

  @Field(() => Date)
  @ApiProperty({ description: 'Unique identifier for the certification' })
  deleted_at?: Date;

  @Field(() => Date)
  @ApiProperty({ description: 'Unique identifier for the certification' })
  created_at: Date;

  @Field(() => Date)
  @ApiProperty({ description: 'Unique identifier for the certification' })
  updated_at: Date;

  @Field(() => [String])
  @ApiProperty({ description: 'Unique identifier for the certification' })
  tags: string[];

  @Field(() => [VariantResponse])
  @ApiProperty({
    type: [VariantResponse],
    description: 'An Array of Variants for the product',
  })
  variants: VariantResponse[];
}
