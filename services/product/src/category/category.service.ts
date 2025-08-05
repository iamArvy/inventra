import { Injectable } from '@nestjs/common';
import { CategoryDto, CategoryInput, PartialCategoryInput } from './dto';
import { CategoryRepository } from './category.repository';
import { BadRequestException } from 'src/common/helpers/grpc-exception';

@Injectable()
export class CategoryService {
  constructor(private readonly repo: CategoryRepository) {}

  async create(store_id: string, data: CategoryInput) {
    const categoryname = await this.repo.findByName(store_id, data.name);
    if (categoryname)
      throw new BadRequestException(
        'Category with name already exist for this store',
      );
    const category = await this.repo.create(store_id, data);
    return CategoryDto.from(category);
  }

  async list() {
    const categories = await this.repo.list();
    return { categories: CategoryDto.fromMany(categories) };
  }

  async getById(id: string) {
    const category = await this.repo.findByIdOrThrow(id);
    return CategoryDto.from(category);
  }

  async getByName(store_id: string, name: string) {
    const category = await this.repo.findByNameOrThrow(store_id, name);
    return CategoryDto.from(category);
  }

  async listStoreCategories(id: string) {
    const categories = await this.repo.listByStore(id);
    return { categories };
  }

  async update(id: string, data: PartialCategoryInput) {
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
