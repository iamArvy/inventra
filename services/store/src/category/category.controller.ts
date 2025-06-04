import { Controller } from '@nestjs/common';
import { GrpcMethod, MessagePattern, Payload } from '@nestjs/microservices';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @GrpcMethod()
  create(data: CreateCategoryDto) {
    return this.categoryService.create(data);
  }

  @MessagePattern('findAllCategory')
  findAll() {
    return this.categoryService.getAllCategories();
  }

  @MessagePattern('findOneCategory')
  findOne(@Payload() id: string) {
    return this.categoryService.getCategory(id);
  }

  @MessagePattern('updateCategory')
  update(@Payload() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(updateCategoryDto.id, updateCategoryDto);
  }

  @MessagePattern('removeCategory')
  remove(@Payload() id: string) {
    return this.categoryService.deleteCategory(id);
  }
}
