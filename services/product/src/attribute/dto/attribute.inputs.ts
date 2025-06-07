import { PartialType } from '@nestjs/mapped-types';

export class AttributeInput {
  key: string;
  value: string;
}

export class CreateAttributeInput {
  key: string;
  value: string;
  variant_id: string;
  store_id?: string;
  product_id?: string;
}

export class FindAttributeInput {
  variant_id?: string;
  orderBy?: { key?: 'asc' | 'desc'; value?: 'asc' | 'desc' };
  skip?: number;
  take?: number;
}

export class UpdateAttributeInput extends PartialType(AttributeInput) {
  id: string;
}
