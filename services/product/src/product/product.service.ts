import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Product } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductInput } from './dto/product.inputs';
// import { Product } from 'generated/prisma';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class ProductService {
  constructor(
    private cacheManager: CacheService,
    private prisma: PrismaService,
  ) {}
  async getProduct(id: string) {
    const cacheKey = `product:${id}`;
    const cached = await this.cacheManager.get<Product>(cacheKey);
    if (cached) {
      console.log('Returning from cache');
      return cached;
    }
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        variants: {
          include: {
            attributes: true,
          },
        },
        category: true,
      },
    });
    if (!product) throw new NotFoundException('Product Not Found');
    await this.cacheManager.set(cacheKey, product, 60 * 1000); // 1 min TTL
    return product;
  }

  async getProductsByCategory(cid: string) {
    const products = await this.prisma.product.findMany({
      where: { category_id: cid },
    });

    return products;
  }

  async getStoreProducts(sid: string) {
    const products = await this.prisma.product.findMany({
      where: {
        store_id: sid,
      },
    });

    return products;
  }

  async createProduct(store_id: string, data: CreateProductInput) {
    const { name, description, category_id, tags, variant } = data;
    const { sku, stock, price, attributes } = variant;
    const product = await this.prisma.product.create({
      data: {
        name,
        description,
        category_id,
        store_id,
        tags,
        variants: {
          create: {
            sku: sku,
            stock: stock,
            price: price,
            attributes: {
              createMany: {
                data: attributes.map((attr) => ({
                  key: attr.key,
                  value: attr.value,
                })),
              },
            },
          },
        },
      },
    });

    const cacheKey = `product:${product.id}`;

    await this.cacheManager.set(cacheKey, product, 60 * 1000); // 1 min TTL
    return product;
  }

  async updateProduct(id: string, data: Prisma.ProductUpdateInput) {
    const product = await this.prisma.product.update({
      where: { id },
      data,
    });
    return product;
  }

  async deleteProduct(id: string) {
    await this.updateProduct(id, { deleted_at: new Date() });
    return true;
  }
}
