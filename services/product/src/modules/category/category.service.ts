import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CategoryInput,
  ListCategoryInput,
  PartialCategoryInput,
} from 'src/dto';
import { CategoryRepository } from 'src/db/repository/category.repository';
import { CacheService } from 'src/common/cache/cache.service';
import { Category } from 'generated/prisma';
import { BaseService } from 'src/common/base/base.service';

@Injectable()
export class CategoryService extends BaseService {
  constructor(
    private readonly repo: CategoryRepository,
    private readonly cacheService: CacheService,
  ) {
    super();
  }

  async create(store_id: string, data: CategoryInput) {
    try {
      const categoryname = await this.repo.findByName(store_id, data.name);
      if (categoryname)
        throw new BadRequestException(
          'Category with name already exist for this store',
        );
      const category = await this.repo.create({ ...data, store_id });
      return category;
    } catch (error) {
      this.handleError(error, 'CategoryService.create');
    }
  }

  async list(params: ListCategoryInput) {
    const cacheKey = ``;
    try {
      const cachedValue = await this.cacheService.get<Category[]>(cacheKey);
      if (cachedValue) return cachedValue;
      const categories = await this.repo.find(params);
      await this.cacheService.set<Category[]>(cacheKey, categories);
      return categories;
    } catch (error) {
      this.handleError(error, 'CategoryService.list');
    }
  }

  async getById(id: string) {
    const cacheKey = `category:${id}`;
    try {
      const cachedValue = await this.cacheService.get<Category>(cacheKey);
      if (cachedValue) return cachedValue;
      const category = await this.repo.findByIdOrThrow(id);
      await this.cacheService.set<Category>(cacheKey, category);
      return category;
    } catch (error) {
      this.handleError(error, 'CategoryService.getById');
    }
  }

  async getByName(store_id: string, name: string) {
    const cacheKey = `category:${name}`;
    try {
      const cachedValue = await this.cacheService.get<Category>(cacheKey);
      if (cachedValue) return cachedValue;
      const category = await this.repo.findByNameOrThrow(store_id, name);
      await this.cacheService.set<Category>(cacheKey, category);
      return category;
    } catch (error) {
      this.handleError(error, 'CategoryService.getByName');
    }
  }

  async listStoreCategories(id: string, params: ListCategoryInput) {
    const cacheKey = ``;
    try {
      const cachedValue = await this.cacheService.get<Category[]>(cacheKey);
      if (cachedValue) return cachedValue;
      const categories = await this.repo.listByStore(id, params);
      await this.cacheService.set<Category[]>(cacheKey, categories);
      return categories;
    } catch (error) {
      this.handleError(error, 'CategoryService.listStoreCategories');
    }
  }

  async update(id: string, data: PartialCategoryInput) {
    try {
      await this.repo.findByIdOrThrow(id);
      await this.repo.update(id, data);
      return { success: true };
    } catch (error) {
      this.handleError(error, 'CategoryService.update');
    }
  }

  async delete(id: string) {
    try {
      await this.repo.findByIdOrThrow(id);
      await this.repo.delete(id);
      return { success: true };
    } catch (error) {
      this.handleError(error, 'CategoryService.delete');
    }
  }
}
