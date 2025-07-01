import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // allow if no roles specified
    }

    // Define a type for the user object
    const request = context
      .switchToHttp()
      .getRequest<{ user: { role: string } }>();
    const { user } = request;
    return requiredRoles.includes(user?.role);
  }
}
// This guard checks if the user's role matches any of the required roles for the route.
// If no roles are specified, it allows access by default.
// This is useful for protecting routes based on user roles, such as admin, user, etc.
// It uses the Reflector to get metadata set by the Roles decorator.
// This allows for flexible role-based access control in your application.
