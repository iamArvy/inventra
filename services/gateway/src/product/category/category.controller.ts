import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryInput, UpdateCategoryInput } from './dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Put('create')
  createCategory(@Body() data: CreateCategoryInput) {
    return this.categoryService.createCategory(data);
  }

  @Get('')
  async getCategories() {
    return await this.categoryService.getCategories();
  }

  @Get(':id')
  async getCategory(@Param('id') id: string) {
    return await this.categoryService.getCategory(id);
  }

  @Patch(':id/update')
  async updateCategory(
    @Param('id') id: string,
    @Body() data: UpdateCategoryInput,
  ) {
    return await this.categoryService.updateCategory(id, data);
  }

  @Delete(':id/delete')
  async deleteCategory(@Param('id') id: string) {
    return await this.categoryService.deleteCategory(id);
  }
}
