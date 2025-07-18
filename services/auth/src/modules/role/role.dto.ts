import { Role } from 'generated/prisma';

export class RoleDto {
  id: string;
  name: string;
  description: string | null;
  storeId: string;
  createdAt: Date;

  constructor(role: Role) {
    Object.assign(this, role);
  }
}

export class RoleList {
  roles: RoleDto[];
}
