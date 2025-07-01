import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AttributeRepository } from './repository/attribute.repository';
import { CategoryRepository } from './repository/category.repository';
import { ProductRepository } from './repository/product.repository';
import { StoreRepository } from './repository/store.repository';
import { VariantRepository } from './repository/variant.repository';

@Module({
  providers: [
    PrismaService,
    AttributeRepository,
    CategoryRepository,
    ProductRepository,
    StoreRepository,
    VariantRepository,
  ],
  exports: [
    AttributeRepository,
    CategoryRepository,
    ProductRepository,
    StoreRepository,
    VariantRepository,
  ],
})
export class DbModule {}
