import { Body, Controller, Delete, Param, Patch, Put } from '@nestjs/common';
import { AttributeService } from './attribute.service';
import { AttributeInput, UpdateAttributeInput } from './dto';

@Controller('attributes')
export class AttributeController {
  constructor(private readonly attributeService: AttributeService) {}

  @Put('create/:id')
  async addAttributes(@Param('id') id: string, @Body() data: AttributeInput) {
    return await this.attributeService.create(id, data);
  }

  @Patch(':id/update')
  async updateAttributes(@Param('id') id: string, data: UpdateAttributeInput) {
    return await this.attributeService.update(id, data);
  }

  @Delete(':id/delete')
  async removeAttributes(@Param('id') id: string) {
    return await this.attributeService.delete(id);
  }
}
