import { Controller, Get, Inject, OnModuleInit, Param } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { STORE_SERVICE_NAME, StoreServiceClient } from 'src/generated/store';

@Controller('store')
export class StoreController implements OnModuleInit {
  constructor(@Inject('store') private client: ClientGrpc) {}
  private storeService: StoreServiceClient;
  onModuleInit() {
    this.storeService =
      this.client.getService<StoreServiceClient>(STORE_SERVICE_NAME);
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
    const store = await firstValueFrom(this.storeService.getStoreById({ id }));
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
