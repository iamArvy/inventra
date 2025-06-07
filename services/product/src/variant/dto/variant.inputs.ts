import { PartialType } from '@nestjs/mapped-types';
import { AttributeInput } from 'src/attribute/dto';

export class VariantInput {
  sku: string;
  price: number;
  stock: number;
  attributes: AttributeInput[];
}

export class CreateVariantInput extends VariantInput {
  product_id: string;
}

export class UpdateVariantInput extends PartialType(VariantInput) {
  id: string;
}
