import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { STORE_SERVICE_NAME, StoreServiceClient } from 'common/proto/store';
import { BaseClient } from 'grpc-clients/base.client';

@Injectable()
export class StoreGrpcClient extends BaseClient<StoreServiceClient> {
  constructor(@Inject('store') client: ClientGrpc) {
    super(client, STORE_SERVICE_NAME);
  }
}
