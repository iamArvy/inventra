import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { Prisma } from 'generated/prisma';

@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaService) {}
  create(data: Prisma.ProductCreateInput) {
    return this.prisma.product.create({
      data,
    });
  }

  async findById(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  async findByIdOrThrow(id: string) {
    return this.prisma.product.findUniqueOrThrow({
      where: { id },
    });
  }

  async findByIdWithRelationships(id: string) {
    return this.prisma.product.findUnique({
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
  }

  find(params?: {
    where?: Prisma.ProductWhereInput;
    orderBy?: Prisma.ProductOrderByWithRelationInput;
    skip?: number;
    take?: number;
  }) {
    return this.prisma.product.findMany(params);
  }

  listByStore(
    store_id: string,
    params?: {
      orderBy?: Prisma.ProductOrderByWithRelationInput;
      skip?: number;
      take?: number;
    },
  ) {
    return this.prisma.product.findMany({ where: { store_id }, ...params });
  }

  listByCategory(
    category_id: string,
    params?: {
      orderBy?: Prisma.ProductOrderByWithRelationInput;
      skip?: number;
      take?: number;
    },
  ) {
    return this.prisma.product.findMany({ where: { category_id }, ...params });
  }

  update(id: string, data: Prisma.ProductUpdateInput) {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  delete(id: string) {
    return this.update(id, {
      deleted_at: new Date(),
    });
  }
}
