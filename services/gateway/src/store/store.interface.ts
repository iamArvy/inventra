// store.interface.ts
import { Observable } from 'rxjs';

export interface StoreService {
  CreateStore(data: {
    uid: string;
    name: string;
  }): Observable<{ id: string; name: string }>;
  GetStoreById(data: { id: string }): Observable<{ id: string; name: string }>;
  healthCheck({}): Observable<{ status: string }>;
}
export interface CategoryService {
  CreateCategory(data: {
    name: string;
    description?: string;
  }): Observable<{ id: string; name: string }>;
  GetAllCategories(): Observable<{ id: string; name: string }[]>;
  GetCategoryById(data: {
    id: string;
  }): Observable<{ id: string; name: string }>;
  UpdateCategory(data: {
    id: string;
    name?: string;
    description?: string;
  }): Observable<{ id: string; name: string }>;
  DeleteCategory(data: { id: string }): Observable<{ success: boolean }>;
}
