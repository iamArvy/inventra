import { Injectable } from '@nestjs/common';
import { NotFoundException } from 'src/common/helpers/grpc-exception';
import { Category } from 'src/category/category.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

@Injectable()
export class CategoryRepository {
  constructor(@InjectModel(Category.name) private model: Model<Category>) {}

  create(store_id: string, data: CreateCategoryDto) {
    return this.model.create({
      ...data,
      store_id,
    });
  }

  findById(id: string) {
    return this.model.findById(id).exec();
  }

  async findByIdOrThrow(id: string) {
    return this.model
      .findById(id)
      .orFail(new NotFoundException('Category not found'))
      .exec();
  }

  findByName(store_id: string, name: string) {
    return this.model
      .findOne({
        store_id,
        name,
      })
      .exec();
  }

  findByNameOrThrow(store_id: string, name: string) {
    return this.model
      .findOne({
        store_id,
        name,
      })
      .orFail(new NotFoundException('Category not found'))
      .exec();
  }

  list() {
    return this.model.find().exec();
  }

  listByStore(store_id: string) {
    return this.model.find({ store_id }).exec();
  }

  update(id: string, data: UpdateCategoryDto) {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  delete(id: string) {
    return this.model.findByIdAndDelete(id).exec();
  }
}
