import { Controller } from '@nestjs/common';
import { VariantService } from './variant.service';
import {
  CreateVariantInput,
  ListVariantInput,
  UpdateVariantInput,
  ListVariantByRelationInput,
  IdInput,
} from 'src/dto';
import { GrpcMethod } from '@nestjs/microservices';

@Controller('variant')
export class VariantController {
  constructor(private readonly service: VariantService) {}

  @GrpcMethod('ProductService')
  async create({ product_id, data, attributes }: CreateVariantInput) {
    return await this.service.create(product_id, data, attributes);
  }

  @GrpcMethod('ProductService')
  async list(params: ListVariantInput) {
    return await this.service.list(params);
  }

  @GrpcMethod('ProductService')
  async ListProductVariants({ id, params }: ListVariantByRelationInput) {
    return await this.service.listProductVariants(id, params);
  }

  @GrpcMethod('ProductService')
  async get({ id }: IdInput) {
    return await this.service.get(id);
  }

  @GrpcMethod('ProductService')
  async update({ id, data }: UpdateVariantInput) {
    return await this.service.update(id, data);
  }

  @GrpcMethod('ProductService')
  async delete({ id }: IdInput) {
    return await this.service.delete(id);
  }
}
