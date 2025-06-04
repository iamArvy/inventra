import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { AttributeResponse } from 'src/attribute/dto';

@ObjectType()
export class VariantResponse {
  @ApiProperty({
    type: String,
    description: 'ID of the variant',
    example: 'variantid',
  })
  @Field(() => String)
  id: string;

  @ApiProperty({
    type: String,
    description: 'Product ID of the variant',
    example: 'productid',
  })
  @Field(() => String)
  product_id: string;

  @ApiProperty({
    type: String,
    description: 'SKU of the variant',
    example: 'SKU-0001',
  })
  @Field(() => String)
  sku: string;

  @ApiProperty({
    type: Number,
    description: 'Price of the variant',
    example: 'variantid',
  })
  @Field(() => Int)
  price: number;

  @ApiProperty({
    type: Number,
    description: 'Quantity of the variant',
    example: 200,
  })
  @Field(() => Int)
  stock: number;

  @ApiProperty({
    type: Object,
    description: 'Attributes of the variant',
    example: [
      { key: 'size', value: 'M' },
      { key: 'color', value: 'Red' },
    ],
  })
  @Field(() => [AttributeResponse])
  attributes: AttributeResponse[];

  @ApiProperty({
    type: Date,
    description: 'Creation Date of the variant',
  })
  @Field(() => Date)
  created_at: Date;

  @ApiProperty({
    type: Date,
    description: 'Last Update Date of the variant',
  })
  @Field(() => Date)
  updated_at: Date;

  @ApiProperty({
    type: Date,
    description: 'Deletion Date of the variant',
  })
  @Field(() => Date)
  deleted_at?: Date;
}
