import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
} from '@nestjs/common';
import { VariantService } from './variant.service';
import { CreateVariantInput, UpdateVariantInput, VariantResponse } from './dto';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('variant')
export class VariantController {
  constructor(private readonly variantService: VariantService) {}

  @ApiOkResponse({ type: VariantResponse })
  @Put('create')
  createVariant(@Param('id') id: string, @Body() data: CreateVariantInput) {
    return this.variantService.createVariant(id, data);
  }

  @ApiOkResponse({ type: [VariantResponse] })
  @Get('')
  async getVariants() {
    return await this.variantService.getVariants();
  }

  @ApiOkResponse({ type: VariantResponse })
  @Get(':id')
  async getVariant(@Param('id') id: string) {
    return await this.variantService.getVariant(id);
  }

  @Patch(':id/update')
  async updateVariant(
    @Param('id') id: string,
    @Body() data: UpdateVariantInput,
  ) {
    return await this.variantService.updateVariant(id, data);
  }

  @Delete(':id/delete')
  async deleteVariant(@Param('id') id: string) {
    return await this.variantService.deleteVariant(id);
  }
}
