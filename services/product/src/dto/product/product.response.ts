import { CategoryResponse } from 'src/dto/category';
import { VariantResponse } from 'src/dto/variant';

export class ProductResponse {
  name: string;
  description: string;
  category: CategoryResponse;
  deleted_at?: Date;
  created_at: Date;
  updated_at: Date;
  tags: string[];
  variants: VariantResponse[];
}

class Store {
  id: string;
  name: string;
  logo?: string;
  created_at: Date;
  updated_at: Date;
}
export class ProductWthStore extends ProductResponse {
  store: Store;
}
