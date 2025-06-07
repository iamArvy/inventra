import { Controller } from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  CreateCategoryInput,
  FindCategoryInput,
  UpdateCategoryInput,
} from './dto';
import { GrpcMethod } from '@nestjs/microservices';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @GrpcMethod()
  create(data: CreateCategoryInput) {
    return this.categoryService.createCategory(data);
  }

  @GrpcMethod()
  async getById({ id }: { id: string }) {
    return await this.categoryService.getCategoryById(id);
  }

  @GrpcMethod()
  async getByName({ name }: { name: string }) {
    return await this.categoryService.getCategoryByName(name);
  }

  @GrpcMethod()
  async list(data: FindCategoryInput) {
    const categories = await this.categoryService.getCategories(data);
    return { categories };
  }

  @GrpcMethod()
  async update(data: UpdateCategoryInput) {
    return await this.categoryService.update(data);
  }

  @GrpcMethod()
  async delete({ id }: { id: string }) {
    return await this.categoryService.delete(id);
  }
}
