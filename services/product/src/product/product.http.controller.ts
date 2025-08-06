import { UpdateProductDto, CreateProductDto } from './dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { FilterParams } from 'src/common/types/filter-params';

@Controller('products')
export class ProductHttpController {
  constructor(private readonly service: ProductService) {}

  @Put('create')
  create(@Param('id') id: string, @Body() data: CreateProductDto) {
    return this.service.create(id, data);
  }

  @Get('get/:id')
  get(@Param('id') id: string) {
    return this.service.get(id);
  }

  @Get('list/store/:id')
  listStoreProducts(@Param('id') id: string, @Query() params: FilterParams) {
    return this.service.listStoreProducts(id, params);
  }

  @Get('list/category/:id')
  listCategoryProducts(@Param('id') id: string, @Query() params: FilterParams) {
    return this.service.listProductsByCategory(id, params);
  }

  @Get('list')
  list(@Query() params: FilterParams) {
    return this.service.listProducts(params);
  }

  @Patch('update')
  update(@Param('id') id: string, @Body() data: UpdateProductDto) {
    return this.service.update(id, data);
  }

  @Delete('delete/:id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
