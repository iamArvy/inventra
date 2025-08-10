import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProductDto, ProductDto, UpdateProductDto } from './dto';
import { ProductRepository } from 'src/product/product.repository';
import { FilterParams } from 'src/common/types/filter-params';
import { IProductService } from './interfaces/product.service.interface';

@Injectable()
export class ProductService implements IProductService {
  constructor(private repo: ProductRepository) {}

  async get(id: string) {
    const product = await this.repo.findByIdWithRelationships(id, ['category']);
    return ProductDto.from(product);
  }

  async listProducts(data: FilterParams) {
    return ProductDto.fromMany(await this.repo.list(data));
  }

  async listProductsByCategory(category_id: string, data: FilterParams) {
    return ProductDto.fromMany(
      await this.repo.listByCategory(category_id, data),
    );
  }

  async listStoreProducts(id: string, data: FilterParams) {
    return ProductDto.fromMany(await this.repo.listByStore(id, data));
  }

  async create(store_id: string, data: CreateProductDto) {
    const product = await this.repo.create(store_id, data);
    if (!product) throw new InternalServerErrorException('Product Not Created');
    return ProductDto.from(product);
  }

  async update(id: string, data: UpdateProductDto) {
    await this.repo.findByIdOrThrow(id);
    await this.repo.update(id, data);
    return { success: true };
  }

  async delete(id: string) {
    await this.repo.findByIdOrThrow(id);
    await this.repo.delete(id);
    return { success: true };
  }
}
