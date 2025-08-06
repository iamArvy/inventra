import {
  Body,
  Controller,
  Get,
  Patch,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateStoreInput, UpdateStoreInput } from './dto/store.inputs';
import { RestAuthGuard } from 'src/common/guards';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ReqData } from 'src/common/types';
import { StoreService } from './store.service';

@ApiBearerAuth()
@UseGuards(RestAuthGuard)
@Controller('store')
export class StoreController {
  constructor(private readonly service: StoreService) {}
  @Get('health')
  health() {
    return this.service.health();
  }

  @Put('create')
  create(@Req() { user }: ReqData, @Body() data: CreateStoreInput) {
    return this.service.create(user, data);
  }

  @Get('')
  get(@Req() { user }: ReqData) {
    return this.service.get(user.store_id);
  }

  @Patch('update')
  update(@Req() { user }: ReqData, @Body() data: UpdateStoreInput) {
    return this.service.update(user, data);
  }

  // @Post('deactivate')
  // deactivate(@Req() req: { user: { id: string } }) {
  //   return this.storeService.storeDeactivate({});
  // }
}
