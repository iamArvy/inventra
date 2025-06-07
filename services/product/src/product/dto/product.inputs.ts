import { PartialType } from '@nestjs/mapped-types';
import { VariantInput } from 'src/variant/dto';

export class CreateProductInput {
  name: string;
  store_id: string;
  description: string;
  category_id: string;
  tags: string[];
  variant?: VariantInput;
}

export class FindProductInput {
  where?: {
    name?: string;
    category_id?: string;
    store_id?: string;
    variant?: {
      price?: number;
    };
  };
  orderBy?: {
    name?: 'asc' | 'desc';
    variant?: {
      price?: 'asc' | 'desc';
    };
    created_at?: 'asc' | 'desc';
    updated_at?: 'asc' | 'desc';
  };
  skip?: number;
  take?: number;
}

export class UpdateProductInput extends PartialType(CreateProductInput) {
  id: string;
}
