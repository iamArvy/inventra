import { Controller, Get, Inject, OnModuleInit, Param } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { StoreService } from './store.interface';
import { firstValueFrom } from 'rxjs';

@Controller('store')
export class StoreController implements OnModuleInit {
  constructor(@Inject('store') private client: ClientGrpc) {}
  private storeService: StoreService;
  // The storeService is initialized in onModuleInit to ensure that the gRPC service is ready to use.
  // This is necessary because the gRPC client needs to be fully initialized before we can use it.
  // The onModuleInit lifecycle hook is called after the module's dependencies have been resolved.
  // import { StoreService as StoreServiceInterface } from './store.interface'; // Assuming you have a StoreService interface defined
  // This interface should define the methods that the StoreService will implement.
  // The StoreService interface is used to type the storeService variable, ensuring that it adheres to the expected contract.
  // This allows for better type checking and autocompletion in your IDE.
  onModuleInit() {
    this.storeService = this.client.getService<StoreService>('StoreService');
  }

  @Get('health')
  async getHealth() {
    const health = await firstValueFrom(this.storeService.healthCheck({}));
    console.log(health);
    return health;
  }
  // @Get('create/:uid/:name')
  // async createStore(@Param('uid') uid: string, @Param('name') name: string) {
  //   const store = await firstValueFrom(
  //     this.storeService.CreateStore({ uid, name }),
  //   );
  //   console.log(store);
  // }
  @Get(':id')
  async getStore(@Param('id') id: string) {
    const store = await firstValueFrom(this.storeService.GetStoreById({ id }));
    console.log(store);
  }
  @Get('health')
  healthCheck(): string {
    return 'Store service is running';
  }
  @Get('version')
  getVersion(): string {
    return 'Store service version 1.0.0';
  }
}
