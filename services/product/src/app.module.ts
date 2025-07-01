import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ControllerModule } from './controller/controller.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ControllerModule,
  ],
})
export class AppModule {}
