import { Controller } from '@nestjs/common';
import { VariantService } from './variant.service';
import { CreateVariantInput, UpdateVariantInput } from './dto';
import { GrpcMethod } from '@nestjs/microservices';

@Controller('variant')
export class VariantController {
  constructor(private readonly variantService: VariantService) {}

  @GrpcMethod()
  async create(data: CreateVariantInput) {
    return await this.variantService.create(data);
  }

  @GrpcMethod()
  async list() {
    return await this.variantService.getVariants();
  }

  // @GrpcMethod()
  // async getProductVariants() {
  //   return await this.variantService.get();
  // }

  @GrpcMethod()
  async get({ id }: { id: string }) {
    return await this.variantService.getVariant(id);
  }

  @GrpcMethod()
  async update(data: UpdateVariantInput) {
    return await this.variantService.updateVariant(data.id, data);
  }

  @GrpcMethod()
  async delete({ id }: { id: string }) {
    return await this.variantService.deleteVariant(id);
  }
}
