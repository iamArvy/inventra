import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CreateVariantInput, UpdateVariantInput, VariantResponse } from './dto';
import { GqlAuthGuard } from '../../guards';
import { Inject, UseGuards } from '@nestjs/common';
import {
  VARIANT_SERVICE_NAME,
  VariantServiceClient,
} from 'src/generated/product';
import { ClientGrpc } from '@nestjs/microservices';

@Resolver('variants')
export class VariantResolver {
  constructor(@Inject('product') private client: ClientGrpc) {}
  private service: VariantServiceClient;

  onModuleInit() {
    this.service =
      this.client.getService<VariantServiceClient>(VARIANT_SERVICE_NAME);
  }
  @UseGuards(GqlAuthGuard)
  @Mutation(() => VariantResponse, { name: 'create_variant' })
  createVariant(
    @Args('id') id: string,
    @Args('data') data: CreateVariantInput,
  ) {
    return this.service.create(data);
  }

  @Query(() => [VariantResponse], { name: 'all_variant' })
  getVariants() {
    return this.service.list({});
  }

  @Query(() => VariantResponse, { name: 'variant' })
  getVariant(@Args('id') id: string) {
    return this.service.get({ id });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => VariantResponse, { name: 'update_variant' })
  updateVariant(
    @Args('id') id: string,
    @Args('data') data: UpdateVariantInput,
  ) {
    return this.service.update({ id, ...data });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean, { name: 'delete_variant' })
  delete(@Args('id') id: string) {
    return this.service.delete({ id });
  }
}
