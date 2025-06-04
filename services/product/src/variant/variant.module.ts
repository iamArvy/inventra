import { Module } from '@nestjs/common';
import { VariantService } from './variant.service';
import { VariantController } from './variant.controller';
import { VariantResolver } from './variant.resolver';

@Module({
  controllers: [VariantController],
  providers: [VariantService, VariantResolver],
})
export class VariantModule {}
