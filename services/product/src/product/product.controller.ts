import { IdInput } from 'common/dto';
import {
  CreateProductInput,
  UpdateProductInput,
  ListProductByRelationInput,
} from './dto';
import { GrpcMethod } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { ProductService } from './product.service';
import { FilterParams } from 'src/common/types/filter-params';

@Controller('products')
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @GrpcMethod('ProductService')
  create({ store_id, data }: CreateProductInput) {
    return this.service.create(store_id, data);
  }

  @GrpcMethod('ProductService')
  get({ id }: IdInput) {
    return this.service.get(id);
  }

  @GrpcMethod('ProductService')
  listStoreProducts({ id, params }: ListProductByRelationInput) {
    return this.service.listStoreProducts(id, params);
  }

  @GrpcMethod('ProductService')
  listCategoryProducts({ id, params }: ListProductByRelationInput) {
    return this.service.listProductsByCategory(id, params);
  }

  @GrpcMethod('ProductService')
  list(data: FilterParams) {
    return this.service.listProducts(data);
  }

  @GrpcMethod('ProductService')
  update({ id, data }: UpdateProductInput) {
    return this.service.update(id, data);
  }

  @GrpcMethod('ProductService')
  delete({ id }: IdInput) {
    return this.service.delete(id);
  }
}
