import { Controller } from '@nestjs/common';
import { AttributeService } from './attribute.service';
import {
  CreateAttributeInput,
  ListAttributeByRelationInput,
  ListAttributeInput,
  UpdateAttributeInput,
} from '../../dto/attribute';
import { GrpcMethod } from '@nestjs/microservices';
import { IdInput } from 'src/dto';

@Controller('attributes')
export class AttributeController {
  constructor(private readonly attributeService: AttributeService) {}

  @GrpcMethod('AttributeService')
  create({ variant_id, data }: CreateAttributeInput) {
    return this.attributeService.create(variant_id, data);
  }

  @GrpcMethod('AttributeService')
  get({ id }: IdInput) {
    return this.attributeService.get(id);
  }

  @GrpcMethod('AttributeService')
  async list(params: ListAttributeInput) {
    const attributes = await this.attributeService.list(params);
    return { attributes };
  }

  @GrpcMethod('AttributeService')
  async listVariantAttributes({ id, params }: ListAttributeByRelationInput) {
    const attributes = await this.attributeService.listVariantAttributes(
      id,
      params,
    );
    return { attributes };
  }

  @GrpcMethod('AttributeService')
  update({ id, data }: UpdateAttributeInput) {
    return this.attributeService.update(id, data);
  }

  @GrpcMethod('AttributeService')
  delete({ id }: IdInput) {
    return this.attributeService.delete(id);
  }
}
