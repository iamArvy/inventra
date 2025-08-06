import { CategoryDto } from 'category/dto';
import { Expose, plainToInstance, Transform } from 'class-transformer';
import { Product, ProductDocument } from '../product.schema';

export class ProductDto {
  @Expose()
  @Transform(({ obj }: { obj: ProductDocument }) => obj._id.toString())
  id: string;

  @Expose()
  name: string;

  @Expose()
  description?: string;

  @Expose()
  image?: string;

  @Expose()
  store_id: string;

  @Expose()
  category_id: string;

  @Expose()
  sku: string;

  @Expose()
  price: number;

  @Expose()
  stock: number;

  @Expose()
  attributes: Record<string, any>;

  @Expose()
  tags: string[];

  @Expose()
  category?: CategoryDto;

  @Expose()
  deleted_at?: Date;

  @Expose()
  created_at: Date;

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

export class CreateProductDto {
  name: string;
  description?: string;
  image?: string;
  category_id: string;
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, any>;
  tags: string[];
}

export class UpdateProductDto {
  name?: string;
  description?: string;
  image?: string;
  category_id: string;
  sku?: string;
  price?: number;
  attributes?: Record<string, any>;
  tags?: string[];
}
