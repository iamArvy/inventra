import { AttributeResponse } from 'src/attribute/dto';

export class VariantResponse {
  id: string;
  product_id: string;
  sku: string;
  price: number;
  stock: number;
  attributes: AttributeResponse[];
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}
