export class ClientData {
  name: string;
  description: string;
}

export class CreateClientInput {
  storeId: string;
  data: ClientData;
}

export class UpdateClientInput {
  id: string;
  storeId: string;
  data: Partial<ClientData>;
}
