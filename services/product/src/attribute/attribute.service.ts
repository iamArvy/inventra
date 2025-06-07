import { Injectable } from '@nestjs/common';
import {
  CreateAttributeInput,
  FindAttributeInput,
  UpdateAttributeInput,
} from './dto';
import { AttributeRepository } from './attribute.repository';

@Injectable()
export class AttributeService {
  constructor(private repo: AttributeRepository) {}

  async create(data: CreateAttributeInput) {
    const { variant_id, key, value } = data;
    const attribute = await this.repo.create({
      key,
      value,
      variant: {
        connect: {
          id: variant_id,
        },
      },
    });

    return attribute;
  }

  async findById(id: string) {
    const attribute = await this.repo.findById(id);
    return attribute;
  }

  async findByVariantId(variant_id: string) {
    const attributes = await this.repo.find({
      where: {
        variant_id,
      },
    });
    return attributes;
  }

  async find(data: FindAttributeInput) {
    const { variant_id, orderBy, skip, take } = data;
    const attributes = await this.repo.find({
      where: {
        variant_id,
      },
      orderBy,
      skip,
      take,
    });
    return attributes;
  }

  async update(data: UpdateAttributeInput) {
    const { id, key, value } = data;
    const attribute = await this.repo.update(id, { key, value });

    return attribute;
  }

  async delete(id: string) {
    const attribute = await this.repo.delete(id);
    return attribute;
  }
}
