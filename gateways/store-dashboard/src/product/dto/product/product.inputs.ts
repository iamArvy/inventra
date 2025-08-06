import { Field, InputType, PartialType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsObject, IsString } from 'class-validator';
import { VariantInput } from '..';

@InputType()
export class ProductInput {
  @ApiProperty({ description: 'Name of the product' })
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Name of the product' })
  @Field(() => String)
  description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Name of the product' })
  @Field(() => String)
  categoryId: string;

  @ApiProperty({ description: 'Name of the product' })
  @IsArray()
  @IsNotEmpty()
  @Field(() => [String])
  tags: string[];
}

@InputType()
export class CreateProductInput {
  @ApiProperty({ type: ProductInput, description: 'The product details' })
  @IsNotEmpty()
  @IsObject()
  @Field(() => ProductInput)
  data: ProductInput;

  @IsArray()
  @IsNotEmpty()
  @Field(() => [VariantInput])
  @ApiProperty({ type: [VariantInput], description: 'Name of the product' })
  variants: VariantInput[];
}

@InputType()
export class UpdateProductInput extends PartialType(ProductInput) {
  @ApiProperty({ description: 'Name of the product' })
  @IsArray()
  @IsNotEmpty()
  @Field(() => [String])
  tags: string[];
}
