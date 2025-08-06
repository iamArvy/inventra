import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './common/strategies';
import { UserModule } from 'user/user.module';
import { CacheModule } from 'cache/cache.module';
import { AuthModule } from 'auth/auth.module';
import { ProductModule } from 'product/product.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // AuthModule,
    // ProductModule,
    // StoreModule,
    // CategoryModule,
    AuthModule,
    ProductModule,
    UserModule,
    CacheModule,
    AuthModule,
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   autoSchemaFile: true,
    //   playground: true,
    //   sortSchema: true,
    // }),
  ],
  providers: [JwtStrategy],
})
export class AppModule {}
