import {
  Body,
  Controller,
  Delete,
  Inject,
  OnModuleInit,
  Param,
  Patch,
} from '@nestjs/common';
import { UpdateAttributeInput } from './dto';
import { ClientGrpc } from '@nestjs/microservices';
import {
  ATTRIBUTE_SERVICE_NAME,
  AttributeServiceClient,
} from 'src/generated/product';

@Controller('variant_attributes')
export class AttributeController implements OnModuleInit {
  constructor(@Inject('product') private client: ClientGrpc) {}
  private service: AttributeServiceClient;
  onModuleInit() {
    this.service = this.client.getService<AttributeServiceClient>(
      ATTRIBUTE_SERVICE_NAME,
    );
  }

  @Patch(':id/update')
  updateAttributes(@Param('id') id: string, data: UpdateAttributeInput) {
    const value = {
      id,
      ...data,
    };
    return this.service.update(value);
  }

  @Delete(':id/delete')
  removeAttributes(@Param('id') id: string) {
    return this.service.delete({ id });
  }
}
