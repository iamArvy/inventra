import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateProductInput, UpdateProductInput } from '../dto/product.inputs';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { ProductResponse } from '../dto/product.response';
import { RestAuthGuard } from 'src/guards';
import { ClientGrpc } from '@nestjs/microservices';
import {
  AttributeServiceClient,
  PRODUCT_SERVICE_NAME,
  ProductServiceClient,
  VariantServiceClient,
} from 'src/generated/product';

@Controller('product')
export class ProductController {
  constructor(@Inject('product') private client: ClientGrpc) {}
  private productService: ProductServiceClient;
  private categoryService: ProductServiceClient;
  private variantService: VariantServiceClient;
  private AttributeService: AttributeServiceClient;

  onModuleInit() {
    this.productService =
      this.client.getService<ProductServiceClient>(PRODUCT_SERVICE_NAME);
  }

  @UseGuards(RestAuthGuard)
  @ApiOkResponse({
    description: 'Created Product',
    type: ProductResponse,
  })
  @ApiBody({ type: CreateProductInput })
  @Put('create')
  async createProduct(@Body() data: CreateProductInput) {
    return await this.productService.create({ store_id, data });
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
