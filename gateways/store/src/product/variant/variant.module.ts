import { Module } from '@nestjs/common';
import { VariantController } from './variant.controller';
import { VariantResolver } from './variant.resolver';

@Module({
  controllers: [VariantController],
  providers: [VariantResolver],
})
export class VariantModule {}
