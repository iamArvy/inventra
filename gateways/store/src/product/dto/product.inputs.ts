import { Field, InputType, PartialType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { CreateVariantInput } from '../variant/dto';

@InputType()
export class CreateProductInput {
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
  @ApiProperty({ description: 'ID for the Store' })
  @Field(() => String)
  storeId: string;

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

  @IsArray()
  @IsNotEmpty()
  @Field(() => [CreateVariantInput])
  @ApiProperty({ type: CreateVariantInput, description: 'Name of the product' })
  variant: CreateVariantInput;
}

@InputType()
export class UpdateProductInput extends PartialType(CreateProductInput) {}
