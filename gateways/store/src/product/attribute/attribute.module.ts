import { Module } from '@nestjs/common';
import { AttributeController } from './attribute.controller';
import { AttributeResolver } from './attribute.resolver';

@Module({
  controllers: [AttributeController],
  providers: [AttributeResolver],
})
export class AttributeModule {}
