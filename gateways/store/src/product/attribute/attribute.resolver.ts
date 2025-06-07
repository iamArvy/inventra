import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { AttributeResponse, UpdateAttributeInput } from './dto';
import { Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  ATTRIBUTE_SERVICE_NAME,
  AttributeServiceClient,
  CreateAttributeInput,
} from 'src/generated/product';

@Resolver()
export class AttributeResolver {
  constructor(@Inject('product') private client: ClientGrpc) {}
  private service: AttributeServiceClient;
  onModuleInit() {
    this.service = this.client.getService<AttributeServiceClient>(
      ATTRIBUTE_SERVICE_NAME,
    );
  }
  @Mutation(() => AttributeResponse, { name: 'create_attribute' })
  create(@Args('data') data: CreateAttributeInput) {
    return this.service.create(data);
  }

  @Query(() => AttributeResponse, { name: 'get_attribute' })
  get(@Args('id') id: string) {
    return this.service.get({ id });
  }

  @Mutation(() => AttributeResponse, { name: 'update_attribute' })
  update(@Args('id') id: string, @Args('data') data: UpdateAttributeInput) {
    const value = {
      id,
      ...data,
    };
    return this.service.update(value);
  }

  @Mutation(() => AttributeResponse, { name: 'delete_attribute' })
  delete(@Args('id') id: string) {
    return this.service.delete({ id });
  }
}
