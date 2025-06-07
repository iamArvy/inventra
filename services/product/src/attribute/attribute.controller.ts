import { Controller } from '@nestjs/common';
import { AttributeService } from './attribute.service';
import {
  CreateAttributeInput,
  FindAttributeInput,
  UpdateAttributeInput,
} from './dto';
import { GrpcMethod } from '@nestjs/microservices';

@Controller('attributes')
export class AttributeController {
  constructor(private readonly attributeService: AttributeService) {}

  @GrpcMethod()
  async create(data: CreateAttributeInput) {
    // Check if the required fields are present
    // Check if Variant Exists
    return await this.attributeService.create(data);
  }

  @GrpcMethod()
  async get({ id }: { id: string }) {
    return await this.attributeService.findById(id);
  }

  @GrpcMethod()
  async list(data: FindAttributeInput) {
    return await this.attributeService.find(data);
  }

  @GrpcMethod()
  async update(data: UpdateAttributeInput) {
    return await this.attributeService.update(data);
  }

  @GrpcMethod()
  async delete({ id }: { id: string }) {
    return await this.attributeService.delete(id);
  }
}
