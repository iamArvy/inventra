import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductInput, UpdateProductInput } from './dto/product.inputs';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { ProductResponse } from './dto/product.response';
import { RestAuthGuard } from 'src/guards';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(RestAuthGuard)
  @ApiOkResponse({
    description: 'Created Product',
    type: ProductResponse,
  })
  @ApiBody({ type: CreateProductInput })
  @Put('create')
  async createProduct(@Body() data: CreateProductInput) {
    return await this.productService.createProduct('teststoreid', data);
  }

  @Get(':id')
  getProduct(@Param('id') id: string) {
    return this.productService.getProduct(id);
  }

  @Get('store/:id')
  getStoreProducts(@Param('id') sid: string) {
    return this.productService.getStoreProducts(sid);
  }

  @Get('category/:id')
  getCategoryProducts(@Param('id') id: string) {
    return this.productService.getProductsByCategory(id);
  }

  @UseGuards(RestAuthGuard)
  @ApiBody({ type: CreateProductInput })
  @Patch('update/:id')
  updateProduct(@Param('id') id: string, @Body() data: UpdateProductInput) {
    return this.productService.updateProduct(id, data);
  }

  @UseGuards(RestAuthGuard)
  @Delete(':id/delete')
  deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }
}
