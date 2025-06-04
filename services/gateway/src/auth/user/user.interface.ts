import { Observable } from 'rxjs';
import { HealthResponse } from 'src/dto/status.response';

export interface UserService {
  health({}): Observable<HealthResponse>;
  updatePassword(data: {
    id: string;
    oldPassword: string;
    newPassword: string;
  }): Observable<{ success: boolean }>;
  updateEmail(data: {
    id: string;
    email: string;
  }): Observable<{ id: string; email: string }>;
  assignRole(data: {
    user_id: string;
    role_id: string;
  }): Observable<{ success: boolean }>;
  removeRole(data: {
    userId: string;
    roleIds: string;
  }): Observable<{ success: boolean }>;
  // user(data: { id: string }): Observable<{ id: string; email: string }>;
  // users(): Observable<{ id: string; email: string }[]>;
}
