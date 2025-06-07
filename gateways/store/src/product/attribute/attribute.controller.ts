import { CreateAttributeInput } from './../../generated/product';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Patch,
  Put,
} from '@nestjs/common';
import { UpdateAttributeInput } from './dto';
import { ClientGrpc } from '@nestjs/microservices';
import {
  ATTRIBUTE_SERVICE_NAME,
  AttributeServiceClient,
} from 'src/generated/product';

@Controller('attributes')
export class AttributeController implements OnModuleInit {
  constructor(@Inject('product') private client: ClientGrpc) {}
  private service: AttributeServiceClient;
  onModuleInit() {
    this.service = this.client.getService<AttributeServiceClient>(
      ATTRIBUTE_SERVICE_NAME,
    );
  }

  @Put('create')
  create(data: CreateAttributeInput) {
    return this.service.create(data);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.service.get({ id });
  }

  @Patch(':id/update')
  update(@Param('id') id: string, data: UpdateAttributeInput) {
    const value = {
      id,
      ...data,
    };
    return this.service.update(value);
  }

  @Delete(':id/delete')
  delete(@Param('id') id: string) {
    return this.service.delete({ id });
  }
}
