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
import { BaseService } from 'src/common/base/base.service';

@Injectable()
export class VariantService extends BaseService {
  constructor(
    private repo: VariantRepository,
    private productRepo: ProductRepository,
    private attributeRepo: AttributeRepository,
  ) {
    super();
  }

  async create(
    product_id: string,
    data: VariantInput,
    attributes?: AttributeInput[],
  ) {
    try {
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
    } catch (error) {
      this.handleError(error, 'VariantService.create');
    }
  }

  async list(params?: ListVariantInput) {
    try {
      return await this.repo.list(params);
    } catch (error) {
      this.handleError(error, 'VariantService.list');
    }
  }

  async listProductVariants(product_id: string, params?: ListVariantInput) {
    try {
      return await this.repo.listByProduct(product_id, params);
    } catch (error) {
      this.handleError(error, 'VariantService.listProductVariants');
    }
  }

  async get(id: string) {
    try {
      return await this.repo.findById(id);
    } catch (error) {
      this.handleError(error, 'VariantService.get');
    }
  }

  async update(id: string, data: PartialVariantInput) {
    try {
      return await this.repo.update(id, data);
    } catch (error) {
      this.handleError(error, 'VariantService.update');
    }
  }

  async delete(id: string) {
    try {
      return await this.repo.delete(id);
    } catch (error) {
      this.handleError(error, 'VariantService.delete');
    }
  }
}
