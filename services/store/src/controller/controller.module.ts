import { Module } from '@nestjs/common';
import { StoreController } from './store.controller';
import { ServiceModule } from 'src/service/service.module';

@Module({
  imports: [ServiceModule],
  controllers: [StoreController],
})
export class ControllerModule {}
