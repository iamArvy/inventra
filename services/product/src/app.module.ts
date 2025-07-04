import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AttributeModule } from './modules/attribute/attribute.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { VariantModule } from './modules/variant/variant.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AttributeModule,
    CategoryModule,
    ProductModule,
    VariantModule,
  ],
})
export class AppModule {}
