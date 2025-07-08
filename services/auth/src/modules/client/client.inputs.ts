import { IdDataInput, IdStoreDataInput } from 'src/common/dto/app.inputs';

export class ClientInput {
  name: string;
  description?: string;
}

export class CreateClientInput extends IdDataInput<ClientInput> {
  permissions: string[];
}

export class UpdateClientInput extends IdStoreDataInput<Partial<ClientInput>> {}
