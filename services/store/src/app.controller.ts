import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateStoreInput, UpdateStoreInput } from './dto';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @GrpcMethod('StoreService', 'healthCheck')
  health() {
    return { status: 'OK' };
  }

  @GrpcMethod('StoreService', 'CreateStore')
  createStore(uid: string, data: CreateStoreInput) {
    return this.appService.createStore(uid, data);
  }

  @GrpcMethod('StoreService', 'UpdateStore')
  updateStore(data: UpdateStoreInput) {
    return this.appService.updateStore(data.id, data);
  }

  @GrpcMethod('StoreService', 'activateStore')
  activateStore(id: string) {
    return this.appService.activateStore(id);
  }

  @GrpcMethod('StoreService', 'deactivateStore')
  deactivateStore(id: string) {
    return this.appService.deactivateStore(id);
  }

  @GrpcMethod('StoreService', 'GetStoreById')
  getStoreById(id: string) {
    return this.appService.getStoreById(id);
  }

  @GrpcMethod('StoreService', 'GetAllStores')
  getAllStores() {
    return this.appService.getAllStores();
  }

  @GrpcMethod('StoreService', 'GetStoreByOwnerId')
  getStoreByOwnerId(ownerId: string) {
    return this.appService.getStoreByOwnerId(ownerId);
  }

  @GrpcMethod('StoreService', 'GetActiveStores')
  getActiveStores() {
    return this.appService.getActiveStores();
  }

  @GrpcMethod('StoreService', 'GetInactiveStores')
  getInactiveStores() {
    return this.appService.getInactiveStores();
  }

  @GrpcMethod('StoreService', 'GetPendingStores')
  getPendingStores() {
    return this.appService.getPendingStores();
  }
}
