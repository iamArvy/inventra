import { Client } from 'generated/prisma';

export class ClientDto {
  id: string;
  name: string;
  description: string | null;
  storeId: string;
  createdAt: Date;
  updatedAt: Date;
  permissions?: { permissionId: string; permission: { name: string } }[];
  constructor(client: Client) {
    Object.assign(this, client);
  }
}

export class ClientList {
  clients: ClientDto[];
}

export class Secret {
  secret: string;
}
