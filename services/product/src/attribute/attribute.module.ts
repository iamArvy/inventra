import { Module } from '@nestjs/common';
import { AttributeService } from './attribute.service';
import { AttributeController } from './attribute.controller';
import { AttributeRepository } from './attribute.repository';

@Module({
  controllers: [AttributeController],
  providers: [AttributeService, AttributeRepository],
})
export class AttributeModule {}
