import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AttributeService } from './attribute.service';
import { AttributeInput, AttributeResponse, UpdateAttributeInput } from './dto';

@Resolver()
export class AttributeResolver {
  constructor(private readonly attributeService: AttributeService) {}

  @Mutation(() => AttributeResponse, { name: 'create_attribute' })
  async addAttributes(
    @Args('id') id: string,
    @Args('data') data: AttributeInput,
  ) {
    return await this.attributeService.create(id, data);
  }

  @Mutation(() => AttributeResponse, { name: 'update_attribute' })
  async updateAttributes(
    @Args('id') id: string,
    @Args('data') data: UpdateAttributeInput,
  ) {
    return await this.attributeService.update(id, data);
  }

  @Mutation(() => AttributeResponse, { name: 'delete_attribute' })
  async removeAttributes(@Args('id') id: string) {
    return await this.attributeService.delete(id);
  }
}
