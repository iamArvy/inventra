import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AttributeInput, UpdateAttributeInput } from './dto';

@Injectable()
export class AttributeService {
  constructor(private prisma: PrismaService) {}

  async create(variant_id: string, data: AttributeInput) {
    const { key, value } = data;
    const attribute = await this.prisma.variantAttributes.create({
      data: { key, value, variant_id },
    });

    return attribute;
  }

  async update(id: string, data: UpdateAttributeInput) {
    const { key, value } = data;
    const attribute = await this.prisma.variantAttributes.update({
      where: { id },
      data: { key, value },
    });

    return attribute;
  }

  async delete(id: string) {
    const attribute = await this.prisma.variantAttributes.delete({
      where: { id },
    });

    return attribute;
  }
}
