import { Injectable } from '@nestjs/common';
import {
  AttributeInput,
  ListAttributeInput,
  PartialAttributeInput,
} from '../../dto/attribute';
import { AttributeRepository } from 'src/db/repository/attribute.repository';
import { VariantRepository } from 'src/db/repository/variant.repository';
import { CacheService } from 'src/common/cache/cache.service';
import { VariantAttributes } from 'generated/prisma';
import { BaseService } from 'src/common/base/base.service';

@Injectable()
export class AttributeService extends BaseService {
  constructor(
    private repo: AttributeRepository,
    private variantRepo: VariantRepository,
    private cache: CacheService,
  ) {
    super();
  }
  async create(variant_id: string, data: AttributeInput) {
    try {
      await this.variantRepo.findByIdOrThrow(variant_id);
      const attribute = await this.repo.create({
        ...data,
        variant: {
          connect: {
            id: variant_id,
          },
        },
      });
      return attribute;
    } catch (error) {
      this.handleError(error, 'AttributeService.create');
    }
  }

  async get(id: string) {
    const cacheKey = `attribute:${id}`;
    try {
      const cache = await this.cache.get<VariantAttributes>(cacheKey);
      if (cache) return cache;
      const attribute = await this.repo.findByIdOrThrow(id);
      await this.cache.set<VariantAttributes>(cacheKey, attribute);
      return attribute;
    } catch (error) {
      this.handleError(error, 'AttributeService.get');
    }
  }

  async listVariantAttributes(id: string, params: ListAttributeInput) {
    const cacheKey = `variant:${id}:attributes`;
    try {
      const cache = await this.cache.get<VariantAttributes[]>(cacheKey);
      if (cache) return cache;
      const attributes = await this.repo.listByVariant(id, params);
      await this.cache.set<VariantAttributes[]>(cacheKey, attributes);
      return attributes;
    } catch (error) {
      this.handleError(error, 'AttributeService.listVariantAttributes');
    }
  }

  async list(params: ListAttributeInput) {
    const cacheKey = `attributes`;
    try {
      const cache = await this.cache.get<VariantAttributes[]>(cacheKey);
      if (cache) return cache;
      const attributes = await this.repo.list(params);
      await this.cache.set<VariantAttributes[]>(cacheKey, attributes);
      return attributes;
    } catch (error) {
      this.handleError(error, 'AttributeService.list');
    }
  }

  async update(id: string, data: PartialAttributeInput) {
    try {
      await this.repo.findByIdOrThrow(id);
      await this.repo.update(id, data);
      return { success: true };
    } catch (error) {
      this.handleError(error, 'AttributeService.update');
    }
  }

  async delete(id: string) {
    try {
      await this.repo.findByIdOrThrow(id);
      await this.repo.delete(id);
      return { success: true };
    } catch (error) {
      this.handleError(error, 'AttributeService.delete');
    }
  }
}
