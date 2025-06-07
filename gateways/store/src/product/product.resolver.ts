import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/guards';
import { CreateProductInput, ProductResponse, UpdateProductInput } from './dto';
import {
  PRODUCT_SERVICE_NAME,
  ProductServiceClient,
} from 'src/generated/product';
import { ClientGrpc } from '@nestjs/microservices';

@Resolver('product')
export class ProductResolver {
  constructor(@Inject('product') private client: ClientGrpc) {}
  private service: ProductServiceClient;

  onModuleInit() {
    this.service =
      this.client.getService<ProductServiceClient>(PRODUCT_SERVICE_NAME);
  }
  @UseGuards(GqlAuthGuard)
  @Mutation(() => ProductResponse, { name: 'create_product' })
  createProduct(@Args('data') data: CreateProductInput) {
    return this.service.create(data);
  }

  @Query(() => ProductResponse, { name: 'product' })
  getProduct(@Args('id') id: string) {
    return this.service.get({ id });
  }

  @Query(() => [ProductResponse], { name: 'products' })
  products(@Args('id') id: string) {
    return this.service.getStoreProducts({ id });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ProductResponse, { name: 'update_product' })
  update(@Args('id') id: string, @Args('data') data: UpdateProductInput) {
    return this.service.update({ id, ...data });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ProductResponse, { name: 'delete_product' })
  delete(@Args('id') id: string) {
    return this.service.delete({ id });
  }
}
