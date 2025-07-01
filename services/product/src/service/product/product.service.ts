import { Store } from 'src/../generated/prisma/index.d';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Product } from 'generated/prisma';
import {
  ListProductInput,
  ProductInput,
  VariantInput,
  PartialProductInput,
} from 'src/dto';
import { CacheService } from '../cache/cache.service';
import { ProductRepository } from '../../db/repository/product.repository';
import { RpcException } from '@nestjs/microservices';
import { StoreRepository } from 'src/db/repository/store.repository';
import { VariantRepository } from 'src/db/repository/variant.repository';

export interface ProductWithStore extends Product {
  store: Store;
}

@Injectable()
export class ProductService {
  constructor(
    private cacheManager: CacheService,
    private repo: ProductRepository,
    private variantRepo: VariantRepository,
    private storeRepo: StoreRepository,
  ) {}

  private logger: Logger = new Logger(ProductService.name);

  async get(id: string) {
    const cacheKey = `product:${id}`;
    try {
      const cached = await this.cacheManager.get<ProductWithStore>(cacheKey);
      if (cached) return cached;
      const product = await this.repo.findByIdWithRelationships(id);
      if (!product) throw new NotFoundException('Product Not Found');
      const store = (await this.storeRepo.findById(product.store_id)) ?? null;
      const productWithStore = { ...product, store };
      await this.cacheManager.set<ProductWithStore>(
        cacheKey,
        productWithStore,
        60 * 1000,
      );
      return product;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error as object);
    }
  }

  async listProducts(data: ListProductInput) {
    const cacheKey = `products`;
    try {
      const cached = await this.cacheManager.get<Product[]>(cacheKey);
      if (cached) return cached;
      const products = await this.repo.find(data);
      await this.cacheManager.set<Product[]>(cacheKey, products, 60 * 1000);
      return products;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error as object);
    }
  }

  async listProductsByCategory(id: string, data: ListProductInput) {
    const cacheKey = `category:${id}:products`;
    try {
      const cached = await this.cacheManager.get<Product[]>(cacheKey);
      if (cached) return cached;
      const products = await this.repo.listByCategory(id, data);
      await this.cacheManager.set<Product[]>(cacheKey, products, 60 * 1000);
      return products;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error as object);
    }
  }

  async listStoreProducts(id: string, data: ListProductInput) {
    const cacheKey = `store:${id}:products`;
    try {
      const cached = await this.cacheManager.get<Product[]>(cacheKey);
      if (cached) return cached;
      const products = await this.repo.listByStore(id, data);
      await this.cacheManager.set<Product[]>(cacheKey, products, 60 * 1000);
      return products;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error as object);
    }
  }

  async create(
    store_id: string,
    data: ProductInput,
    variants?: VariantInput[],
  ) {
    try {
      const { name, description, category_id, tags } = data;
      const product = await this.repo.create({
        name,
        description,
        tags,
        category: {
          connect: { id: category_id },
        },
        store_id,
      });

      if (!product) throw new NotFoundException('Product Not Created');

      if (variants && variants.length > 0) {
        const variantData = variants.map((variant) => ({
          ...variant,
          product_id: product.id,
          store_id,
        }));

        await this.variantRepo.createMany(variantData);
      }
      return product;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error as object);
    }
  }

  async update(id: string, data: PartialProductInput) {
    try {
      await this.repo.findByIdOrThrow(id);
      await this.repo.update(id, data);
      return { success: true };
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error as object);
    }
  }

  async delete(id: string) {
    try {
      await this.repo.findByIdOrThrow(id);
      await this.repo.delete(id);
      return { success: true };
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error as object);
    }
  }
}
