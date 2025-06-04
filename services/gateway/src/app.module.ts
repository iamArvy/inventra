import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { StoreModule } from './store/store.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { AccountModule } from './account/account.module';
import { OrderModule } from './order/order.module';
import { MediaModule } from './media/media.module';
import { NotificationModule } from './notification/notification.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: ['.env', '.env.local'],
      // ignoreEnvFile: process.env.NODE_ENV === 'production',
      // cache: true,
      // expandVariables: true,
    }),
    StoreModule,
    AuthModule,
    ProductModule,
    AccountModule,
    OrderModule,
    MediaModule,
    NotificationModule,
    PassportModule,
  ],
  controllers: [AppController],
  providers: [JwtStrategy],
})
export class AppModule {}
