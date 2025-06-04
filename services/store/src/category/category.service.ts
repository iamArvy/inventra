import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryRepository } from './category.repository';

@Injectable()
export class CategoryService {
  constructor(private repo: CategoryRepository) {}
  create(data: CreateCategoryDto) {
    return this.repo.create(data);
  }

  getAllCategories() {
    return this.repo.categories({});
  }

  getCategory(id: string) {
    return this.repo.category(id);
  }

  update(id: string, data: UpdateCategoryDto) {
    return this.repo.update(id, data);
  }

  deleteCategory(id: string) {
    return this.repo.remove(id);
  }
}
