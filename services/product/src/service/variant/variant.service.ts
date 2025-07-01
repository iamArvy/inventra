import { Injectable, NotFoundException } from '@nestjs/common';
import {
  VariantInput,
  PartialVariantInput,
  AttributeInput,
  ListVariantInput,
} from 'src/dto';
import { VariantRepository } from 'src/db/repository/variant.repository';
import { ProductRepository } from 'src/db/repository/product.repository';
import { AttributeRepository } from 'src/db/repository/attribute.repository';

@Injectable()
export class VariantService {
  constructor(
    private repo: VariantRepository,
    private productRepo: ProductRepository,
    private attributeRepo: AttributeRepository,
  ) {}

  async create(
    product_id: string,
    data: VariantInput,
    attributes?: AttributeInput[],
  ) {
    await this.productRepo.findByIdOrThrow(product_id);
    const variant = await this.repo.create({
      product: {
        connect: { id: product_id },
      },
      ...data,
    });
    if (!variant) throw new NotFoundException('Variant Not Created');

    if (attributes && attributes.length > 0) {
      const AttributeData = attributes.map((attr) => ({
        ...attr,
        variant_id: variant.id,
      }));

      await this.attributeRepo.createMany(AttributeData);
    }
    return;
  }

  async list(params?: ListVariantInput) {
    return await this.repo.list(params);
  }

  async listProductVariants(product_id: string, params?: ListVariantInput) {
    return await this.repo.listByProduct(product_id, params);
  }

  async get(id: string) {
    return await this.repo.findById(id);
  }

  async update(id: string, data: PartialVariantInput) {
    return await this.repo.update(id, data);
  }

  async delete(id: string) {
    return await this.repo.delete(id);
  }
}
