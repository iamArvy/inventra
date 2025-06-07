import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'generated/prisma';

@Injectable()
export class AttributeRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.VariantAttributesCreateInput) {
    return this.prisma.variantAttributes.create({
      data,
    });
  }

  async findById(id: string) {
    return this.prisma.variantAttributes.findUnique({
      where: { id },
    });
  }

  async findByVariantId(variantId: string) {
    return this.prisma.variantAttributes.findMany({
      where: { variant_id: variantId },
    });
  }

  find(params: {
    where: Prisma.VariantAttributesWhereInput;
    orderBy?: Prisma.VariantAttributesOrderByWithRelationInput;
    skip?: number;
    take?: number;
  }) {
    return this.prisma.variantAttributes.findMany(params);
  }

  update(id: string, data: Prisma.VariantAttributesUpdateInput) {
    return this.prisma.variantAttributes.update({
      where: { id },
      data,
    });
  }

  delete(id: string) {
    return this.prisma.variantAttributes.delete({
      where: { id },
    });
  }
}
