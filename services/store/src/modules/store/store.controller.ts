import { Controller } from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreInput, UpdateStoreInput } from './store.dto';
import { GrpcMethod } from '@nestjs/microservices';
import { IdInput } from 'src/common/dto/app.inputs';

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
    return this.service.create(data);
  }

  @GrpcMethod('StoreService')
  getById(id: string) {
    return this.service.getStoreById(id);
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
  update({ id, data }: UpdateStoreInput) {
    return this.service.update(id, data);
  }

  @GrpcMethod('StoreService')
  list() {
    return this.service.getAllStores();
  }

  @GrpcMethod('StoreService')
  activate({ id }: IdInput) {
    return this.service.activate(id);
  }

  @GrpcMethod('StoreService')
  deactivate({ id }: IdInput) {
    return this.service.deactivate(id);
  }
}
