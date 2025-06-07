import { PartialType } from '@nestjs/mapped-types';
export class CreateCategoryInput {
  name: string;
  description: string;
}

export class FindCategoryInput {
  orderBy?: {
    name?: 'asc' | 'desc';
    created_at?: 'asc' | 'desc';
    updated_at?: 'asc' | 'desc';
  };
  skip?: number;
  take?: number;
}

export class UpdateCategoryInput extends PartialType(CreateCategoryInput) {
  id: string;
}
