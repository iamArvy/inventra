import { Injectable, Logger } from '@nestjs/common';
import { User } from 'src/common/types';
import { CreateStoreInput, UpdateStoreInput } from './dto/store.inputs';
import { StoreGrpcClient } from 'grpc-clients/store';

@Injectable()
export class StoreService {
  constructor(private readonly client: StoreGrpcClient) {}
  private logger = new Logger(this.constructor.name);
  health() {
    return this.client.proxy.health({});
  }

  create({ id }: User, data: CreateStoreInput) {
    const store = this.client.proxy.create({ ownerId: id, data });
    if (store) this.logger.log(`Store created by user: ${id}`);
    return store;
  }

  get(id: string) {
    return this.client.proxy.getById({ id });
  }

  update({ id }: User, data: UpdateStoreInput) {
    const response = this.client.proxy.update({ ownerId: id, data });
    if (response) this.logger.log(`Store: ${id} updated successfully`);
  }

  // deactivate(@Req() req: { user: { id: string } }) {
  //   return this.storeService.storeDeactivate({});
  // }
}
