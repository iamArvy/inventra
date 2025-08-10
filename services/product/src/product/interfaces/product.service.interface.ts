// product.service.interface.ts
import { CreateProductDto, ProductDto, UpdateProductDto } from '../dto';
import { FilterParams } from 'src/common/types/filter-params';

export interface IProductService {
  get(id: string): Promise<ProductDto>;
  listProducts(data: FilterParams): Promise<ProductDto[]>;
  listProductsByCategory(
    category_id: string,
    data: FilterParams,
  ): Promise<ProductDto[]>;
  listStoreProducts(id: string, data: FilterParams): Promise<ProductDto[]>;
  create(store_id: string, data: CreateProductDto): Promise<ProductDto>;
  update(id: string, data: UpdateProductDto): Promise<{ success: boolean }>;
  delete(id: string): Promise<{ success: boolean }>;
}
