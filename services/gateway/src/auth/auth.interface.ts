// store.interface.ts
import { Observable } from 'rxjs';
import { LoginInput, RegisterInput } from './dto/auth.inputs';
import { AuthResponse } from './dto/auth.response';
import { HealthResponse } from 'src/dto/status.response';

export interface AuthService {
  health({}): Observable<HealthResponse>;
  register(data: RegisterInput): Observable<AuthResponse>;
  login(data: LoginInput): Observable<AuthResponse>;
}
