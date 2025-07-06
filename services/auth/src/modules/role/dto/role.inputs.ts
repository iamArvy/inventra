export class RoleData {
  name: string;
  permissions: string[];
  description?: string;
}

export class CreateRoleInput {
  storeId: string;
  data: RoleData;
}
// export class UpdateRoleData implements PartialType(RoleData)

export class UpdateRoleInput {
  id: string;
  storeId: string;
  data: RoleData;
}
