import { Module } from '@nestjs/common';
import { ProductGrpcController } from './product.grpc.controller';
import { ProductService } from './product.service';
import { ProductRepository } from './product.repository';
import { Product, ProductSchema } from './product.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductHttpController } from './product.http.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  controllers: [ProductGrpcController, ProductHttpController],
  providers: [ProductService, ProductRepository],
})
export class ProductModule {}
