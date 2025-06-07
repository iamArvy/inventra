import { Controller } from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreInput, UpdateStoreInput } from '../dto';
import { GrpcMethod, RpcException } from '@nestjs/microservices';

@Controller()
export class StoreController {
  constructor(private readonly service: StoreService) {}

  @GrpcMethod('StoreService', 'Health')
  health() {
    console.log('Health check called');
    return { status: 'OK' };
  }

  @GrpcMethod('StoreService')
  create(data: CreateStoreInput) {
    return this.service.createStore(data.ownerId, data.data);
  }

  @GrpcMethod('StoreService')
  getById(id: string) {
    return this.service.getStoreById(id);
  }

  @GrpcMethod('StoreService')
  getByOwner({ id }: { id: string }) {
    if (!id) throw new RpcException('Owner ID is required');
    return this.service.getStoreByOwnerId(id);
  }

  @GrpcMethod('StoreService')
  getActive() {
    return this.service.getActiveStores();
  }

  @GrpcMethod('StoreService')
  getInactive() {
    return this.service.getInactiveStores();
  }

  @GrpcMethod('StoreService')
  getPending() {
    return this.service.getPendingStores();
  }

  @GrpcMethod('StoreService')
  update(data: UpdateStoreInput) {
    if (!data.ownerId) throw new RpcException('Owner ID is required');
    return this.service.updateStore(data.ownerId, data.data);
  }

  @GrpcMethod('StoreService')
  list() {
    return this.service.getAllStores();
  }

  @GrpcMethod('StoreService')
  activate(id: string) {
    return this.service.activateStore(id);
  }

  @GrpcMethod('StoreService')
  deactivate(id: string) {
    return this.service.deactivateStore(id);
  }
}
