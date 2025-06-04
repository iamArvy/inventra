import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductResolver } from './product.resolver';

@Module({
  controllers: [ProductController],
  providers: [ProductService, ProductResolver],
})
export class ProductModule {}
