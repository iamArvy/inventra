import { Permission } from 'generated/prisma';

export class PermissionDto {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;

  constructor(permission: Permission) {
    Object.assign(this, permission);
  }
}

export class PermissionList {
  permissions: PermissionDto[];
}
