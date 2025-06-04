import { Injectable } from '@nestjs/common';
import { CreateCategoryInput, UpdateCategoryInput } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}
  async createCategory(data: CreateCategoryInput) {
    const category = await this.prisma.category.create({
      data,
    });

    return category;
  }

  async getCategories() {
    const categories = await this.prisma.category.findMany();

    return categories;
  }

  async getCategory(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    return category;
  }

  async updateCategory(id: string, data: UpdateCategoryInput) {
    await this.prisma.category.update({ where: { id }, data });
  }

  async deleteCategory(id: string) {
    await this.prisma.category.delete({ where: { id } });
  }
}
