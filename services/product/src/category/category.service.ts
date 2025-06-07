import { Injectable } from '@nestjs/common';
import {
  CreateCategoryInput,
  FindCategoryInput,
  UpdateCategoryInput,
} from './dto';
import { CategoryRepository } from './category.repository';

@Injectable()
export class CategoryService {
  constructor(private readonly repo: CategoryRepository) {}
  async createCategory(data: CreateCategoryInput) {
    const category = await this.repo.create(data);

    return category;
  }

  async getCategories(data: FindCategoryInput) {
    const { orderBy, skip, take } = data;

    const categories = await this.repo.find({
      orderBy,
      skip,
      take,
    });

    return categories;
  }

  async getCategoryById(id: string) {
    const category = await this.repo.findById(id);
    return category;
  }

  async getCategoryByName(name: string) {
    const category = await this.repo.findByName(name);
    return category;
  }

  async update(data: UpdateCategoryInput) {
    const { id, name, description } = data;
    await this.repo.update(id, { description, name });
  }

  async delete(id: string) {
    await this.repo.delete(id);
  }
}
