import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/guards';
import { CreateProductInput, ProductResponse, UpdateProductInput } from './dto';
import { ProductService } from './product.service';

@Resolver('product')
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ProductResponse, { name: 'create_product' })
  async createProduct(@Args('data') data: CreateProductInput) {
    return await this.productService.createProduct('teststoreid', data);
  }

  @Query(() => ProductResponse, { name: 'product' })
  getProduct(@Args('id') id: string) {
    return this.productService.getProduct(id);
  }

  @Query(() => [ProductResponse], { name: 'store_products' })
  getStoreProducts(@Args('id') sid: string) {
    return this.productService.getStoreProducts(sid);
  }

  @Query(() => [ProductResponse], { name: 'category_products' })
  getCategoryProducts(@Args('id') id: string) {
    return this.productService.getProductsByCategory(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ProductResponse, { name: 'update_product' })
  updateProduct(
    @Args('id') id: string,
    @Args('data') data: UpdateProductInput,
  ) {
    return this.productService.updateProduct(id, data);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ProductResponse, { name: 'delete_product' })
  deleteProduct(@Args('id') id: string) {
    return this.productService.deleteProduct(id);
  }
}
