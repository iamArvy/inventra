import { CategoryDto } from 'category/dto';
import { Expose, plainToInstance, Transform, Type } from 'class-transformer';
import { Product, ProductDocument } from '../product.schema';
import {
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {
  @ApiProperty({
    description: 'Unique identifier of the product',
    example: 'product_123',
  })
  @IsString()
  @IsNotEmpty()
  @Expose()
  @Transform(({ obj }: { obj: ProductDocument }) => obj._id.toString())
  id: string;

  @Expose()
  @ApiProperty({
    description: 'Name of the product',
    example: 'Wireless Headphones',
  })
  name: string;

  @ApiProperty({
    description: 'Description of the product',
    example: 'High-quality wireless headphones with noise cancellation.',
  })
  @IsString()
  @IsOptional()
  @Expose()
  description?: string;

  @ApiProperty({
    description: 'Image URL of the product',
    example: 'https://example.com/images/headphones.jpg',
  })
  @IsString()
  @IsOptional()
  @Expose()
  @Transform(({ obj }: { obj: ProductDocument }) => obj.image || null)
  image?: string;

  @ApiProperty({
    description: 'ID of the store where the product is available',
    example: 'store_123',
  })
  @IsString()
  @IsNotEmpty()
  @Expose()
  store_id: string;

  @ApiProperty({
    description: 'SKU (Stock Keeping Unit) of the product',
    example: 'SKU12345',
  })
  @IsString()
  @IsNotEmpty()
  @Expose()
  sku: string;

  @ApiProperty({
    description: 'Price of the product',
    example: 999,
  })
  @IsInt()
  @IsDefined()
  @Expose()
  price: number;

  @ApiProperty({
    description: 'Stock quantity of the product',
    example: 100,
  })
  @IsInt()
  @IsDefined()
  @Expose()
  stock: number;

  @ApiProperty({
    description: 'Attributes of the product',
    type: 'object',
    additionalProperties: true,
    example: { color: 'black', size: 'medium' },
  })
  @IsOptional()
  @Expose()
  attributes: Record<string, any>;

  @ApiProperty({
    description: 'Tags associated with the product',
    type: [String],
    example: ['electronics', 'headphones'],
  })
  @IsOptional()
  @IsString({ each: true })
  @Expose()
  tags: string[];

  @ApiProperty({
    description: 'Category details of the product',
    type: CategoryDto,
    required: false,
  })
  @Expose()
  @Type(() => CategoryDto)
  category: CategoryDto;

  @ApiProperty({
    description: 'Date when the product was created',
    type: Date,
    example: '2023-10-01T12:00:00Z',
  })
  @IsNotEmpty()
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the product was deleted',
    type: Date,
    required: false,
  })
  @IsOptional()
  @Expose()
  @Transform(({ obj }: { obj: ProductDocument }) => obj.deletedAt || null)
  deletedAt?: Date;

  static from(data: Product): ProductDto {
    return plainToInstance(ProductDto, data, {
      excludeExtraneousValues: true,
    });
  }

  static fromMany(data: ProductDocument[]): ProductDto[] {
    return plainToInstance(ProductDto, data, {
      excludeExtraneousValues: true,
    });
  }
}
