import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of the product',
    example: 'Wireless Headphones',
  })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Description of the product',
    example: 'High-quality wireless headphones with noise cancellation.',
    required: false,
  })
  description?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Image URL of the product',
    example: 'https://example.com/images/headphones.jpg',
    required: false,
  })
  image?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'ID of the category for product',
    example: 'category_123',
  })
  category: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'SKU (Stock Keeping Unit) of the product',
    example: 'SKU12345',
  })
  sku: string;

  @IsInt()
  @IsDefined()
  @ApiProperty({
    description: 'Price of the product',
    example: 999,
  })
  price: number;

  @IsInt()
  @IsDefined()
  @ApiProperty({
    description: 'Stock quantity of the product',
    example: 100,
  })
  stock: number;

  @IsOptional()
  @IsObject()
  @ApiProperty({
    description: 'Attributes of the product',
    type: 'object',
    additionalProperties: true,
  })
  attributes?: Record<string, any>;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    description: 'Tags associated with the product',
    type: [String],
    example: ['electronics', 'headphones'],
    required: false,
  })
  tags?: string[];
}
