import { Module } from '@nestjs/common';
import { ControllerModule } from './controller/controller.module';
import { ConfigModule } from '@nestjs/config';
import { BaseModule } from './common/base/base.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ControllerModule,
    BaseModule,
  ],
})
export class AppModule {}
