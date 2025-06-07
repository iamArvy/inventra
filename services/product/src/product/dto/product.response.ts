import { CategoryResponse } from 'src/category/dto';
import { VariantResponse } from 'src/variant/dto';

export class ProductResponse {
  name: string;
  description: string;
  store: {
    id: string;
    name: string;
  };
  category: CategoryResponse;
  deleted_at?: Date;
  created_at: Date;
  updated_at: Date;
  tags: string[];
  variants: VariantResponse[];
}
