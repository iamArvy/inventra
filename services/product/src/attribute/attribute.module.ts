import { Module } from '@nestjs/common';
import { AttributeService } from './attribute.service';
import { AttributeController } from './attribute.controller';
import { AttributeResolver } from './attribute.resolver';

@Module({
  controllers: [AttributeController],
  providers: [AttributeService, AttributeResolver],
})
export class AttributeModule {}
