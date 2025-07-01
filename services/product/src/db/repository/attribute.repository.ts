import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
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

  async findByIdOrThrow(id: string) {
    return this.prisma.variantAttributes.findUniqueOrThrow({
      where: { id },
    });
  }

  list(params?: {
    orderBy?: Prisma.VariantAttributesOrderByWithRelationInput;
    skip?: number;
    take?: number;
  }) {
    return this.prisma.variantAttributes.findMany(params);
  }

  listByVariant(
    variant_id: string,
    params?: {
      orderBy?: Prisma.VariantAttributesOrderByWithRelationInput;
      skip?: number;
      take?: number;
    },
  ) {
    return this.prisma.variantAttributes.findMany({
      where: { variant_id },
      ...params,
    });
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

  createMany(
    data:
      | Prisma.VariantAttributesCreateManyInput
      | Prisma.VariantAttributesCreateManyInput[],
  ) {
    return this.prisma.variantAttributes.createMany({
      data,
      skipDuplicates: true,
    });
  }
}
