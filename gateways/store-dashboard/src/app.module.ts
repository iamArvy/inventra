import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './common/strategies';
// import { AuthModule } from './module/auth/auth.module';
// import { ProductModule } from './module/product/product.module';
// import { StoreModule } from './module/store/store.module';
// import { CategoryModule } from './module/category/category.module';
// import { GraphQLModule } from '@nestjs/graphql';
// import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo
import { UserModule } from './module/user/user.module';
import { CacheModule } from './cache/cache.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // AuthModule,
    // ProductModule,
    // StoreModule,
    // CategoryModule,
    UserModule,
    CacheModule,
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
