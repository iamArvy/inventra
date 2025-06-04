import { Field, InputType, PartialType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateCategoryInput {
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
}

@InputType()
export class UpdateCategoryInput extends PartialType(CreateCategoryInput) {}
