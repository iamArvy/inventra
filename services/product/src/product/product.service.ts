import { Injectable } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto';
import { ProductRepository } from 'src/product/product.repository';
// import { StoreRepository } from 'src/db/repository/repositories/store.repository';
import {
  InternalServerErrorException,
  NotFoundException,
} from 'src/common/helpers/grpc-exception';
import { FilterParams } from 'src/common/types/filter-params';

@Injectable()
export class ProductService {
  constructor(
    private repo: ProductRepository,
    // private storeRepo: StoreRepository,
  ) {}

  async get(id: string) {
    const product = await this.repo.findByIdWithRelationships(id);
    if (!product) throw new NotFoundException('Product Not Found');
    // const store = (await this.storeRepo.findById(product.store_id)) ?? null;
    const productWithStore = { ...product };
    return productWithStore;
  }

  async listProducts(data: FilterParams) {
    const products = await this.repo.list(data);
    return { products };
  }

  async listProductsByCategory(category_id: string, data: FilterParams) {
    const products = await this.repo.listByCategory(category_id, data);
    return { products };
  }

  async listStoreProducts(id: string, data: FilterParams) {
    const products = await this.repo.listByStore(id, data);
    return { products };
  }

  async create(store_id: string, data: CreateProductDto) {
    const product = await this.repo.create(store_id, data);

    if (!product) throw new InternalServerErrorException('Product Not Created');
    return product;
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
