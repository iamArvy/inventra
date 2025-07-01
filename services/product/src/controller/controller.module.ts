import { Module } from '@nestjs/common';
import { ServiceModule } from 'src/service/service.module';
import { AttributeController } from './attribute/attribute.controller';
import { CategoryController } from './category/category.controller';
import { ProductController } from './product/product.controller';
import { VariantController } from './variant/variant.controller';

@Module({
  imports: [ServiceModule],
  controllers: [
    AttributeController,
    CategoryController,
    ProductController,
    VariantController,
  ],
})
export class ControllerModule {}
