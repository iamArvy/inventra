import { Observable } from 'rxjs';
import { HealthResponse } from 'src/dto/status.response';

export interface RoleService {
  health({}): Observable<HealthResponse>;
  create(data: {
    name: string;
    description?: string;
  }): Observable<{ id: string; name: string }>;
  roles({}): Observable<{ id: string; name: string }[]>;
  role(data: { id: string }): Observable<{ id: string; name: string }>;
  deleteRole(data: { id: string }): Observable<{ success: boolean }>;
}
