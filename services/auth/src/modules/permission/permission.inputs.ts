import { IdDataInput } from 'src/common/dto/app.inputs';

export class PermissionInput {
  name: string;
  description?: string;
}

export class UpdatePermissionInput extends IdDataInput<
  Partial<PermissionInput>
> {}
