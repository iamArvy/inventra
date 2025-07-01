import { PartialType } from '@nestjs/mapped-types';
import { AttributeInput } from '..';
import { CreateInput, ListInput, UpdateInput } from '../app.inputs';

export class VariantInput {
  sku: string;
  price: number;
  stock: number;
}

export class CreateVariantInput extends CreateInput<VariantInput> {
  product_id: string;
  attributes: AttributeInput[];
}

export class PartialVariantInput extends PartialType(VariantInput) {}

export class UpdateVariantInput extends UpdateInput<PartialVariantInput> {}

class OrderInput {
  price?: 'asc' | 'desc';
  created_at?: 'asc' | 'desc';
  updated_at?: 'asc' | 'desc';
}

export class ListVariantInput extends ListInput<OrderInput> {}
export class ListVariantByRelationInput {
  id: string;
  params: ListVariantInput;
}
