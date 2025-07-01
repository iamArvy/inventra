import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { Prisma } from 'generated/prisma';

@Injectable()
export class VariantRepository {
  constructor(private readonly prisma: PrismaService) {}
  create(data: Prisma.VariantCreateInput) {
    return this.prisma.variant.create({
      data,
    });
  }

  async findById(id: string) {
    return this.prisma.variant.findUnique({
      where: { id },
    });
  }

  async findByIdOrThrow(id: string) {
    return this.prisma.variant.findUniqueOrThrow({
      where: { id },
    });
  }

  list(params?: {
    where?: Prisma.VariantWhereInput;
    orderBy?: Prisma.VariantOrderByWithRelationInput;
    skip?: number;
    take?: number;
  }) {
    return this.prisma.variant.findMany(params);
  }

  listByProduct(
    product_id: string,
    params?: {
      orderBy?: Prisma.VariantOrderByWithRelationInput;
      skip?: number;
      take?: number;
    },
  ) {
    return this.prisma.variant.findMany({ where: { product_id }, ...params });
  }

  update(id: string, data: Prisma.VariantUpdateInput) {
    return this.prisma.variant.update({
      where: { id },
      data,
    });
  }

  delete(id: string) {
    return this.prisma.variant.delete({
      where: { id },
    });
  }

  createMany(
    data: Prisma.VariantCreateManyInput | Prisma.VariantCreateManyInput[],
  ) {
    return this.prisma.variant.createMany({ data, skipDuplicates: true });
  }
}
