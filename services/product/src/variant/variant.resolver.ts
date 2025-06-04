import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CreateVariantInput, UpdateVariantInput, VariantResponse } from './dto';
import { VariantService } from './variant.service';
import { GqlAuthGuard } from '../guards';
import { UseGuards } from '@nestjs/common';

@Resolver('variants')
export class VariantResolver {
  constructor(private readonly variantService: VariantService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => VariantResponse, { name: 'create_variant' })
  createVariant(
    @Args('id') id: string,
    @Args('data') data: CreateVariantInput,
  ) {
    return this.variantService.createVariant(id, data);
  }

  @Query(() => [VariantResponse], { name: 'all_variant' })
  async getVariants() {
    return await this.variantService.getVariants();
  }

  @Query(() => VariantResponse, { name: 'variant' })
  async getVariant(@Args('id') id: string) {
    return await this.variantService.getVariant(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => VariantResponse, { name: 'update_variant' })
  async updateVariant(
    @Args('id') id: string,
    @Args('data') data: UpdateVariantInput,
  ) {
    return await this.variantService.updateVariant(id, data);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean, { name: 'delete_variant' })
  async deleteVariant(@Args('id') id: string) {
    return await this.variantService.deleteVariant(id);
  }
}
