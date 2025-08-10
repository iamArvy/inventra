import { PartialType } from '@nestjs/mapped-types';
import { CreateInput, ListInput, UpdateInput } from 'common/dto';
import { FilterParams } from 'src/common/types/filter-params';
import { CreateProductDto } from './create-product.dto';
import { UpdateProductDto } from './update-product.dto';

export class ProductInput {
  name: string;
  description: string;
  category_id: string;
  tags: string[];
}

export class CreateProductInput extends CreateInput<CreateProductDto> {
  store_id: string;
}
class OrderInput {
  name?: 'asc' | 'desc';
  variant?: {
    price?: 'asc' | 'desc';
  };
  created_at?: 'asc' | 'desc';
  updated_at?: 'asc' | 'desc';
}

export class PartialProductInput extends PartialType(ProductInput) {}

export class ListProductInput extends ListInput<OrderInput> {}
export class ListProductByRelationInput {
  id: string;
  params: FilterParams;
}
export class UpdateProductInput extends UpdateInput<UpdateProductDto> {}
