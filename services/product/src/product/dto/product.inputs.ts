import { Field, InputType, PartialType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { CreateVariantInput } from 'src/variant/dto';

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
  @ApiProperty({ description: 'Name of the product' })
  @Field(() => String)
  category_id: string;

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
