import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'generated/prisma';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: Prisma.CategoryCreateInput) {
    return await this.prisma.category.create({
      data,
    });
  }

  categories(params: {
    where?: Prisma.CategoryWhereInput;
    select?: Prisma.CategorySelect;
  }) {
    return this.prisma.category.findMany(params);
  }

  category(id: string) {
    return this.prisma.category.findUnique({ where: { id } });
  }

  update(id: string, data: Prisma.CategoryUpdateInput) {
    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.category.delete({ where: { id } });
  }
}
