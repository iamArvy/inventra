import { Controller, Get, Param } from '@nestjs/common';
// import {
//   CreateProductInput,
//   UpdateProductInput,
// } from './dto/product/product.inputs';
// import { ApiBearerAuth } from '@nestjs/swagger';
// import { ProductResponse } from './dto/product/product.response';
// import { RestAuthGuard } from 'src/common/guards';
import { ProductService } from './product.service';
// import { ReqData } from 'src/common/types';
// import {
//   VariantResponse,
//   VariantInput,
//   UpdateVariantInput,
//   AttributeInput,
//   UpdateAttributeInput,
// } from './dto';

// @ApiBearerAuth()
// @UseGuards(RestAuthGuard)
@Controller('products')
export class ProductController {
  constructor(private product: ProductService) {}

  // @ApiOkResponse({
  //   description: 'Created Product',
  //   type: ProductResponse,
  // })
  // @ApiBody({ type: CreateProductInput })
  // @Put('create')
  // create(
  //   @Req()
  //   { user }: ReqData,
  //   @Body() data: CreateProductInput,
  // ) {
  //   return this.product.create(user, data);
  // }

  // @Get()
  // async list(@Req() { user }: ReqData) {
  //   return this.product.list(user);
  // }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.product.get(id);
  }

  // @ApiBody({ type: CreateProductInput })
  // @Patch(':id/update')
  // update(
  //   @Req() { user }: ReqData,
  //   @Param('id') id: string,
  //   @Body() data: UpdateProductInput,
  // ) {
  //   return this.product.update(user, id, data);
  // }

  // @Delete(':id/delete')
  // deleteProduct(@Req() { user }: ReqData, @Param('id') id: string) {
  //   return this.product.delete(user, id);
  // }

  // @ApiOkResponse({ type: VariantResponse })
  // @Put(':id/create-variant')
  // createVariant(
  //   @Req() { user }: ReqData,
  //   @Param('id') id: string,
  //   @Body() data: VariantInput,
  // ) {
  //   return this.variant.create(user, id, data);
  // }

  // // @ApiOkResponse({ type: [VariantResponse] })
  // // @Get(':id')
  // // getVariants(@Param('id') id: string) {
  // //   return this.service.productVariants(id);
  // // }

  // @ApiOkResponse({ type: VariantResponse })
  // @Get(':id')
  // getVariant(@Param('id') id: string) {
  //   return this.variant.get(id);
  // }

  // @Patch('variants/:id/update')
  // updateVariant(
  //   @Req() { user }: ReqData,
  //   @Param('id') id: string,
  //   @Body() data: UpdateVariantInput,
  // ) {
  //   return this.variant.update(user, id, data);
  // }

  // @Delete('variants/:id/delete')
  // deleteVariant(@Req() { user }: ReqData, @Param('id') id: string) {
  //   return this.variant.delete(user, id);
  // }

  // @Put('variants/:id/create-attribute')
  // createAttribute(
  //   @Req()
  //   { user }: ReqData,
  //   @Param('id') id: string,
  //   data: AttributeInput,
  // ) {
  //   return this.attribute.create(user, id, data);
  // }

  // @Get('attributes/:id')
  // getAttribute(
  //   @Req()
  //   { user }: ReqData,
  //   @Param('id') id: string,
  // ) {
  //   return this.attribute.get(user, id);
  // }

  // @Patch('attributes/:id/update')
  // updateAttribute(
  //   @Req()
  //   { user }: ReqData,
  //   @Param('id') id: string,
  //   data: UpdateAttributeInput,
  // ) {
  //   return this.attribute.update(user, id, data);
  // }

  // @Delete('attributes/:id/delete')
  // deleteAttribute(
  //   @Req()
  //   { user }: ReqData,
  //   @Param('id') id: string,
  // ) {
  //   return this.attribute.delete(user, id);
  // }
}
