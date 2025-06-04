import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { VariantModule } from './variant/variant.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from './cache/cache.module';
import { CategoryModule } from './category/category.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AttributeModule } from './attribute/attribute.module';
import { StoreModule } from './store/store.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      sortSchema: true,
    }),
    ProductModule,
    VariantModule,
    PrismaModule,
    CategoryModule,
    AttributeModule,
    StoreModule,
  ],
})
export class AppModule {}
