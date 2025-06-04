import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CategoryResponse,
  CreateCategoryInput,
  UpdateCategoryInput,
} from './dto';
import { CategoryService } from './category.service';

@Resolver()
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Mutation(() => CategoryResponse, { name: 'create_category' })
  createCategory(@Args('data') data: CreateCategoryInput) {
    return this.categoryService.createCategory(data);
  }

  @Query(() => [CategoryResponse], { name: 'all_category' })
  async getCategories() {
    return await this.categoryService.getCategories();
  }

  @Query(() => CategoryResponse, { name: 'category' })
  async getCategory(@Args('id') id: string) {
    return await this.categoryService.getCategory(id);
  }

  @Mutation(() => CategoryResponse, { name: 'update_category' })
  async updateCategory(
    @Args('id') id: string,
    @Args('data') data: UpdateCategoryInput,
  ) {
    return await this.categoryService.updateCategory(id, data);
  }

  @Mutation(() => CategoryResponse, { name: 'delete_category' })
  async deleteCategory(@Args('id') id: string) {
    return await this.categoryService.deleteCategory(id);
  }
}
