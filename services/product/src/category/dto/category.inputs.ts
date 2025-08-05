import { CreateInput, ListInput, UpdateInput } from 'common/dto';
import { PartialType } from '@nestjs/mapped-types';

export class CategoryInput {
  name: string;
  description: string;
}

export class CreateCategoryInput extends CreateInput<CategoryInput> {
  store_id: string;
}

class OrderInput {
  name?: 'asc' | 'desc';
  created_at?: 'asc' | 'desc';
  updated_at?: 'asc' | 'desc';
}

export class PartialCategoryInput extends PartialType(CategoryInput) {}

export class ListCategoryInput extends ListInput<OrderInput> {}
export class ListCategoryByRelationInput {
  id: string;
  data: ListCategoryInput;
}
export class UpdateCategoryInput extends UpdateInput<PartialCategoryInput> {}
