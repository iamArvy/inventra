import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVariantInput, UpdateVariantInput } from './dto';

@Injectable()
export class VariantService {
  constructor(private prisma: PrismaService) {}

  createVariant(product_id: string, data: CreateVariantInput) {
    const { sku, price, stock, attributes } = data;
    return this.prisma.variant.create({
      data: {
        product_id,
        sku,
        price,
        stock,
        attributes: {
          createMany: {
            data: attributes.map((attr) => ({
              key: attr.key,
              value: attr.value,
            })),
          },
        },
      },
    });
  }

  async getVariants() {
    return await this.prisma.variant.findMany();
  }

  async getVariant(id: string) {
    return await this.prisma.variant.findUnique({ where: { id } });
  }

  async updateVariant(id: string, data: UpdateVariantInput) {
    const { sku, price, stock } = data;
    return await this.prisma.variant.update({
      where: { id },
      data: {
        sku,
        price,
        stock,
      },
    });
  }

  async deleteVariant(id: string) {
    return await this.prisma.variant.delete({ where: { id } });
  }
}
