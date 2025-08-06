import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { BaseClient } from '../base.client';
import {
  PRODUCT_SERVICE_NAME,
  ProductServiceClient,
} from 'common/proto/product/product';

@Injectable()
export class ProductGrpcClient extends BaseClient<ProductServiceClient> {
  constructor(@Inject('product') client: ClientGrpc) {
    super(client, PRODUCT_SERVICE_NAME);
  }
}
