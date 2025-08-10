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
import { CreateCategoryDto, PartialCategoryInput } from './dto';

@Controller('categories')
export class CategoryHttpController {
  constructor(private readonly service: CategoryService) {}

  @Put('create/store/:id')
  create(@Param('id') id: string, @Body() data: CreateCategoryDto) {
    return this.service.create(id, data);
  }

  @Get('get/:id')
  getById(@Param('id') id: string) {
    return this.service.getById(id);
  }

  // @Get('get/name/:id/:name')
  // getByName({ id, name }: { id: string; name: string }) {
  //   return this.service.getByName(id, name);
  // }

  @Get('list')
  async list() {
    const categories = await this.service.list();
    return { categories };
  }

  @Get('list/store/:id')
  async listStoreCategories(@Param('id') id: string) {
    const categories = await this.service.listStoreCategories(id);
    return { categories };
  }

  @Patch('update')
  update(@Param('id') id: string, @Body() data: PartialCategoryInput) {
    return this.service.update(id, data);
  }

  @Delete('delete/:id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
