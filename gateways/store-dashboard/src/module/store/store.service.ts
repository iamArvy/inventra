import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { AppService } from 'src/app.service';
import {
  STORE_SERVICE_NAME,
  StoreServiceClient,
} from 'src/common/generated/store';
import { User } from 'src/common/types';
import {
  CreateStoreInput,
  UpdateStoreInput,
} from 'src/module/store/dto/store.inputs';

@Injectable()
export class StoreService extends AppService<StoreServiceClient> {
  constructor(@Inject('store') client: ClientGrpc) {
    super(client, STORE_SERVICE_NAME);
  }

  health() {
    try {
      return this.service.health({});
    } catch (error) {
      this.handleError(error, 'Health check failed');
    }
  }

  async create({ id }: User, data: CreateStoreInput) {
    try {
      const store = await this.call(this.service.create({ ownerId: id, data }));
      if (store) this.logger.log(`Store created by user: ${id}`);
      return store;
    } catch (error) {
      this.handleError(error, `Store creation failed for user: ${id}`);
    }
  }

  get(id: string) {
    try {
      return this.service.getById({ id });
    } catch (error) {
      this.handleError(error, `Failed to get store: ${id}`);
    }
  }

  async update({ id }: User, data: UpdateStoreInput) {
    try {
      const response = await this.call(
        this.service.update({ ownerId: id, data }),
      );
      if (response.status) this.logger.log(`Store: ${id} updated successfully`);
    } catch (error) {
      this.handleError(error, `Failed to update store: ${id}`);
    }
  }

  // deactivate(@Req() req: { user: { id: string } }) {
  //   return this.storeService.storeDeactivate({});
  // }
}
