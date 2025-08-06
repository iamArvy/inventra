import { IdInput } from 'common/dto';
import {
  CreateProductInput,
  UpdateProductInput,
  ListProductByRelationInput,
  ProductDto,
} from './dto';
import { GrpcMethod } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { ProductService } from './product.service';
import { FilterParams } from 'src/common/types/filter-params';
import { runRpcMethod } from 'src/common/helpers/run-rpc-method';
import { Status } from 'src/common/dto/app.response';

@Controller('products')
export class ProductGrpcController {
  constructor(private readonly service: ProductService) {}

  @GrpcMethod('ProductService')
  create({ store_id, data }: CreateProductInput) {
    return runRpcMethod<ProductDto>(this.service.create(store_id, data));
  }

  @GrpcMethod('ProductService')
  get({ id }: IdInput) {
    return runRpcMethod<ProductDto>(this.service.get(id));
  }

  @GrpcMethod('ProductService')
  listStoreProducts({ id, params }: ListProductByRelationInput) {
    return runRpcMethod<{ products: ProductDto[] }>(
      this.service.listStoreProducts(id, params),
    );
  }

  @GrpcMethod('ProductService')
  listCategoryProducts({ id, params }: ListProductByRelationInput) {
    return runRpcMethod<{ products: ProductDto[] }>(
      this.service.listProductsByCategory(id, params),
    );
  }

  @GrpcMethod('ProductService')
  list(data: FilterParams) {
    return runRpcMethod<{ products: ProductDto[] }>(
      this.service.listProducts(data),
    );
  }

  @GrpcMethod('ProductService')
  update({ id, data }: UpdateProductInput) {
    return runRpcMethod<Status>(this.service.update(id, data));
  }

  @GrpcMethod('ProductService')
  delete({ id }: IdInput) {
    return runRpcMethod<Status>(this.service.delete(id));
  }
}
