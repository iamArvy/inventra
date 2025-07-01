import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/common/guards';
import {
  AttributeInput,
  AttributeResponse,
  CreateProductInput,
  ProductResponse,
  UpdateAttributeInput,
  UpdateProductInput,
  UpdateVariantInput,
  VariantInput,
  VariantResponse,
} from 'src/module/product/dto';
import { ProductService } from './services/product/product.service';
import { VariantService } from './services/variant/variant.service';
import { AttributeService } from './services/attributes/attribute.service';
import { ReqData } from 'src/common/types';

@UseGuards(GqlAuthGuard)
@Resolver('product')
export class ProductResolver {
  constructor(
    private product: ProductService,
    private variant: VariantService,
    private attribute: AttributeService,
  ) {}

  @Mutation(() => ProductResponse, { name: 'create_product' })
  async createProduct(
    @Context()
    { user }: ReqData,
    @Args('data') data: CreateProductInput,
  ) {
    return this.product.create(user, data);
  }

  @Query(() => ProductResponse, { name: 'product' })
  getProduct(@Args('id') id: string) {
    return this.product.get(id);
  }

  @Query(() => [ProductResponse], { name: 'products' })
  products(
    @Context()
    { user }: ReqData,
  ) {
    return this.product.list(user);
  }

  @Mutation(() => ProductResponse, { name: 'update_product' })
  update(
    @Context()
    { user }: ReqData,
    @Args('id') id: string,
    @Args('data') data: UpdateProductInput,
  ) {
    return this.product.update(user, id, data);
  }

  @Mutation(() => ProductResponse, { name: 'delete_product' })
  delete(
    @Context()
    { user }: ReqData,
    @Args('id') id: string,
  ) {
    return this.product.delete(user, id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => VariantResponse, { name: 'create_variant' })
  createVariant(
    @Context()
    { user }: ReqData,
    @Args('id') id: string,
    @Args('data') data: VariantInput,
  ) {
    return this.variant.create(user, id, data);
  }

  // @Query(() => [VariantResponse], { name: 'all_variant' })
  // getVariants() {
  //   return this.service.list({});
  // }

  @Query(() => VariantResponse, { name: 'variant' })
  getVariant(@Args('id') id: string) {
    return this.variant.get(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => VariantResponse, { name: 'update_variant' })
  updateVariant(
    @Context()
    { user }: ReqData,
    @Args('id') id: string,
    @Args('data') data: UpdateVariantInput,
  ) {
    return this.variant.update(user, id, data);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean, { name: 'delete_variant' })
  deleteVariant(
    @Context()
    { user }: ReqData,
    @Args('id') id: string,
  ) {
    return this.variant.delete(user, id);
  }

  @Mutation(() => AttributeResponse, { name: 'create_attribute' })
  createAttribute(
    @Context()
    { user }: ReqData,
    @Args('id') id: string,
    @Args('data') data: AttributeInput,
  ) {
    return this.attribute.create(user, id, data);
  }

  @Query(() => AttributeResponse, { name: 'get_attribute' })
  getAttribute(
    @Context()
    { user }: ReqData,
    @Args('id') id: string,
  ) {
    return this.attribute.get(user, id);
  }

  @Mutation(() => AttributeResponse, { name: 'update_attribute' })
  updateAttribute(
    @Context()
    { user }: ReqData,
    @Args('id') id: string,
    @Args('data') data: UpdateAttributeInput,
  ) {
    return this.attribute.update(user, id, data);
  }

  @Mutation(() => AttributeResponse, { name: 'delete_attribute' })
  deleteAttribute(
    @Context()
    { user }: ReqData,
    @Args('id') id: string,
  ) {
    return this.attribute.delete(user, id);
  }
}
