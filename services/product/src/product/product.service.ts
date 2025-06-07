import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from 'generated/prisma';
import {
  CreateProductInput,
  FindProductInput,
  UpdateProductInput,
} from './dto/product.inputs';
import { CacheService } from '../cache/cache.service';
import { ProductRepository } from './product.repository';
import { VariantService } from 'src/variant/variant.service';

@Injectable()
export class ProductService {
  constructor(
    private cacheManager: CacheService,
    private repo: ProductRepository,
    private variantService: VariantService,
  ) {}

  async get(id: string) {
    const cacheKey = `product:${id}`;
    const cached = await this.cacheManager.get<Product>(cacheKey);
    if (cached) {
      console.log('Returning from cache');
      return cached;
    }
    const product = await this.repo.findByIdWithRelationships(id);
    if (!product) throw new NotFoundException('Product Not Found');
    await this.cacheManager.set(cacheKey, product, 60 * 1000); // 1 min TTL
    return product;
  }

  async getProductsByCategory(category_id: string) {
    const products = await this.repo.find({
      where: { category_id },
    });

    return products;
  }

  async getProducts(data: FindProductInput) {
    const products = await this.repo.find(data);
    return products;
  }

  async getStoreProducts(store_id: string) {
    const products = await this.repo.find({
      where: {
        store_id,
        deleted_at: null,
      },
    });

    return products;
  }

  async create(data: CreateProductInput) {
    const { store_id, name, description, category_id, tags, variant } = data;
    const product = await this.repo.create({
      name,
      description,
      tags,
      category: {
        connect: { id: category_id },
      },
      store: {
        connect: { id: store_id },
      },
    });

    if (!product) throw new NotFoundException('Product Not Created');
    if (variant) {
      await this.variantService.create({ product_id: product.id, ...variant });
    }
    return { success: true };
  }

  async update(data: UpdateProductInput) {
    const { id, name, description } = data;
    await this.repo.update(id, {
      name,
      description,
    });
    return { success: true };
  }

  async delete(id: string) {
    await this.repo.update(id, {
      deleted_at: new Date(),
    });
    return { success: true };
  }
}
