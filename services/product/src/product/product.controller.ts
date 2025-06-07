import { GrpcMethod } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { ProductService } from './product.service';
import {
  CreateProductInput,
  FindProductInput,
  UpdateProductInput,
} from './dto/product.inputs';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @GrpcMethod()
  async create(data: CreateProductInput) {
    return await this.productService.create(data);
  }

  @GrpcMethod()
  get({ id }: { id: string }) {
    return this.productService.get(id);
  }

  @GrpcMethod()
  getStoreProducts({ id }: { id: string }) {
    return this.productService.getStoreProducts(id);
  }

  @GrpcMethod()
  getCategoryProducts({ id }: { id: string }) {
    return this.productService.getProductsByCategory(id);
  }

  @GrpcMethod()
  list(data: FindProductInput) {
    return this.productService.getProducts(data);
  }

  @GrpcMethod()
  update(data: UpdateProductInput) {
    return this.productService.update(data);
  }

  @GrpcMethod()
  delete({ id }: { id: string }) {
    return this.productService.delete(id);
  }
}
