import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './product.schema';
import { Model, Types } from 'mongoose';
import { FilterParams } from 'src/common/types/filter-params';

@Injectable()
export class ProductRepository {
  constructor(@InjectModel(Product.name) private model: Model<Product>) {}
  create(store_id: string, data: CreateProductDto) {
    return this.model.create({
      store_id,
      ...data,
    });
  }

  findById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product ID format');
    }
    return this.model.findById(id).exec();
  }

  async findByIdOrThrow(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product ID format');
    }
    return this.model
      .findById(id)
      .orFail(new NotFoundException('Product not found'))
      .exec();
  }

  findByIdWithRelationships(
    id: string,
    relationships: string[],
  ): Promise<Product> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product ID format');
    }
    return this.model
      .findById(id, {
        populate: relationships,
      })
      .orFail(new NotFoundException('Product not found'))
      .exec();
  }

  list(params?: FilterParams) {
    const { where = {}, orderBy = {}, skip = 0, take = 10 } = params ?? {};
    return this.model.find(where).sort(orderBy).skip(skip).limit(take).exec();
  }

  listByStore(store_id: string, params?: FilterParams) {
    const { where = {}, orderBy = {}, skip = 0, take = 10 } = params ?? {};
    return this.model
      .find({ ...where, store_id })
      .sort(orderBy)
      .skip(skip)
      .limit(take)
      .exec();
  }

  listByCategory(category_id: string, params?: FilterParams) {
    const { where = {}, orderBy = {}, skip = 0, take = 10 } = params ?? {};

    return this.model
      .find({ ...where, category_id })
      .sort(orderBy)
      .skip(skip)
      .limit(take)
      .exec();
  }

  update(id: string, data: UpdateProductDto) {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  delete(id: string) {
    return this.model.findByIdAndUpdate(id, {
      deleted_at: new Date(),
    });
  }
}
