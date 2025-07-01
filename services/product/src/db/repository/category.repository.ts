import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { Prisma } from 'generated/prisma';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}
  create(data: Prisma.CategoryCreateInput) {
    return this.prisma.category.create({
      data,
    });
  }

  async findById(id: string) {
    return this.prisma.category.findUnique({
      where: { id },
    });
  }

  async findByIdOrThrow(id: string) {
    return this.prisma.category.findUniqueOrThrow({
      where: { id },
    });
  }

  async findByName(store_id: string, name: string) {
    return this.prisma.category.findUnique({
      where: { store_id_name: { store_id, name } },
    });
  }

  async findByNameOrThrow(store_id: string, name: string) {
    return this.prisma.category.findUniqueOrThrow({
      where: { store_id_name: { store_id, name } },
    });
  }

  find(params?: {
    where?: Prisma.CategoryWhereInput;
    orderBy?: Prisma.CategoryOrderByWithRelationInput;
    skip?: number;
    take?: number;
  }) {
    return this.prisma.category.findMany(params);
  }

  listByStore(
    store_id: string,
    params?: {
      orderBy?: Prisma.CategoryOrderByWithRelationInput;
      skip?: number;
      take?: number;
    },
  ) {
    return this.prisma.category.findMany({ where: { store_id }, ...params });
  }

  update(id: string, data: Prisma.CategoryUpdateInput) {
    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  delete(id: string) {
    return this.prisma.category.delete({
      where: { id },
    });
  }
}
