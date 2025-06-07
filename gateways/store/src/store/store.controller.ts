import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Patch,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
// import { firstValueFrom } from 'rxjs';
import { STORE_SERVICE_NAME, StoreServiceClient } from 'src/generated/store';
import { CreateStoreInput, UpdateStoreInput } from './dto/store.inputs';
import { RestAuthGuard } from '../guards';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(RestAuthGuard)
@Controller('store')
export class StoreController implements OnModuleInit {
  constructor(@Inject('store') private client: ClientGrpc) {}
  private storeService: StoreServiceClient;
  onModuleInit() {
    this.storeService =
      this.client.getService<StoreServiceClient>(STORE_SERVICE_NAME);
  }

  @Get('health')
  health() {
    return this.storeService.health({});
  }

  @Put('create')
  create(@Req() req: { user: { id: string } }, @Body() data: CreateStoreInput) {
    return this.storeService.create({ ownerId: req.user.id, data });
  }

  @Get('')
  getUserStore(@Req() req: { user: { id: string } }) {
    return this.storeService.getByOwner({ id: req.user.id });
  }

  @Patch('update')
  update(@Req() req: { user: { id: string } }, @Body() data: UpdateStoreInput) {
    return this.storeService.update({ ownerId: req.user.id, data });
  }

  // @Post('deactivate')
  // deactivate(@Req() req: { user: { id: string } }) {
  //   return this.storeService.storeDeactivate({});
  // }
}
