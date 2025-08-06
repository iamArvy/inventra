import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductGrpcClientModule } from 'grpc-clients/product/product.grpc.module';
import { CategoryController } from './category/category.controller';
import { CategoryService } from './category/category.service';

@Module({
  imports: [ProductGrpcClientModule],
  providers: [ProductService, CategoryService],
  controllers: [ProductController, CategoryController],
})
export class ProductModule {}
