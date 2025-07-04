import { Controller } from '@nestjs/common';
import { CategoryService } from './category.service';
import { GrpcMethod } from '@nestjs/microservices';
import {
  IdInput,
  CreateCategoryInput,
  UpdateCategoryInput,
  ListCategoryInput,
  ListCategoryByRelationInput,
} from 'src/dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @GrpcMethod('CategoryService')
  create({ store_id, data }: CreateCategoryInput) {
    return this.service.create(store_id, data);
  }

  @GrpcMethod('CategoryService')
  getById({ id }: IdInput) {
    return this.service.getById(id);
  }

  @GrpcMethod('CategoryService')
  getByName({ id, name }: { id: string; name: string }) {
    return this.service.getByName(id, name);
  }

  @GrpcMethod('CategoryService')
  async list(data: ListCategoryInput) {
    const categories = await this.service.list(data);
    return { categories };
  }

  @GrpcMethod('CategoryService')
  async listStoreCategories({ id, data }: ListCategoryByRelationInput) {
    const categories = await this.service.listStoreCategories(id, data);
    return { categories };
  }

  @GrpcMethod('CategoryService')
  update({ id, data }: UpdateCategoryInput) {
    return this.service.update(id, data);
  }

  @GrpcMethod('CategoryService')
  delete({ id }: IdInput) {
    return this.service.delete(id);
  }
}
