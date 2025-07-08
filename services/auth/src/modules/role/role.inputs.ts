import { IdDataInput, IdStoreDataInput } from 'src/common/dto/app.inputs';

export class RoleInput {
  name: string;
  description?: string;
}

export class CreateRoleInput extends IdDataInput<RoleInput> {
  permissions: string[];
}

export class UpdateRoleInput extends IdStoreDataInput<Partial<RoleInput>> {}
