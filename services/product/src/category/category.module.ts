import { Module } from '@nestjs/common';
import { CategoryGrpcController } from './category.grpc.controller';
import { CategoryService } from './category.service';
import { CategoryRepository } from './category.repository';
import { Category, CategorySchema } from './category.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryHttpController } from './category.http.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [CategoryGrpcController, CategoryHttpController],
  providers: [CategoryService, CategoryRepository],
})
export class CategoryModule {}
