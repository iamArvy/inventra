import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateProductInput, UpdateProductInput } from './dto/product.inputs';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { ProductResponse } from './dto/product.response';
import { RestAuthGuard } from 'src/guards';
import { ClientGrpc } from '@nestjs/microservices';
import {
  PRODUCT_SERVICE_NAME,
  ProductServiceClient,
} from 'src/generated/product';

@Controller('product')
export class ProductController {
  constructor(@Inject('product') private client: ClientGrpc) {}
  private service: ProductServiceClient;

  onModuleInit() {
    this.service =
      this.client.getService<ProductServiceClient>(PRODUCT_SERVICE_NAME);
  }

  @UseGuards(RestAuthGuard)
  @ApiOkResponse({
    description: 'Created Product',
    type: ProductResponse,
  })
  @ApiBody({ type: CreateProductInput })
  @Put('create')
  create(@Body() data: CreateProductInput) {
    return this.service.create(data);
  }

  @Get(':id')
  product(@Param('id') id: string) {
    return this.service.get({ id });
  }

  @Get(':id')
  products(@Query('id') id: string) {
    return this.service.getStoreProducts({ id });
  }

  @UseGuards(RestAuthGuard)
  @ApiBody({ type: CreateProductInput })
  @Patch('update/:id')
  updateProduct(@Param('id') id: string, @Body() data: UpdateProductInput) {
    return this.service.update({ id, ...data });
  }

  @UseGuards(RestAuthGuard)
  @Delete(':id/delete')
  deleteProduct(@Param('id') id: string) {
    return this.service.delete({ id });
  }
}
