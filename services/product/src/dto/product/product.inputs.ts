import { PartialType } from '@nestjs/mapped-types';
import { VariantInput } from 'src/dto/variant';
import { CreateInput, ListInput, UpdateInput } from '../app.inputs';

export class ProductInput {
  name: string;
  description: string;
  category_id: string;
  tags: string[];
}

export class CreateProductInput extends CreateInput<ProductInput> {
  store_id: string;
  variants?: VariantInput[];
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
  params: ListProductInput;
}
export class UpdateProductInput extends UpdateInput<PartialProductInput> {}
