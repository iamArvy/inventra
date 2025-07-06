export class CreatePermissionInput {
  name: string;
  description?: string;
}

export class UpdatePermissionInput {
  id: string;
  data: Partial<CreatePermissionInput>;
}
