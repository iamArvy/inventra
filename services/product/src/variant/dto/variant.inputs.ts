import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { AttributeInput } from 'src/attribute/dto';

@InputType()
export class CreateVariantInput {
  @ApiProperty({ description: 'SKU of the variant', example: 'SKU-0001' })
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  sku: string;

  @ApiProperty({ description: 'Price of the variant' })
  @IsInt()
  @IsNotEmpty()
  @Field(() => Int)
  price: number;

  @ApiProperty({ description: 'Stock of the Variant' })
  @IsInt()
  @IsNotEmpty()
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
  @IsArray()
  @IsNotEmpty()
  @Field(() => [AttributeInput])
  attributes: AttributeInput[];
}

@InputType()
export class UpdateVariantInput extends PartialType(CreateVariantInput) {}
