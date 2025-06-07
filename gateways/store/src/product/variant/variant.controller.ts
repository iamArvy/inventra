import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Put,
} from '@nestjs/common';
import { CreateVariantInput, UpdateVariantInput, VariantResponse } from './dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { ClientGrpc } from '@nestjs/microservices';
import {
  VARIANT_SERVICE_NAME,
  VariantServiceClient,
} from 'src/generated/product';

@Controller('variant')
export class VariantController {
  constructor(@Inject('product') private client: ClientGrpc) {}
  private service: VariantServiceClient;

  onModuleInit() {
    this.service =
      this.client.getService<VariantServiceClient>(VARIANT_SERVICE_NAME);
  }

  @ApiOkResponse({ type: VariantResponse })
  @Put('create')
  createVariant(@Body() data: CreateVariantInput) {
    return this.service.create(data);
  }

  @ApiOkResponse({ type: [VariantResponse] })
  @Get('')
  getVariants() {
    return this.service.list({});
  }

  @ApiOkResponse({ type: VariantResponse })
  @Get(':id')
  getVariant(@Param('id') id: string) {
    return this.service.get({ id });
  }

  @Patch(':id/update')
  updateVariant(@Param('id') id: string, @Body() data: UpdateVariantInput) {
    return this.service.update({ id, ...data });
  }

  @Delete(':id/delete')
  deleteVariant(@Param('id') id: string) {
    return this.service.delete({ id });
  }
}
