import { Client } from 'generated/prisma';

export class ClientDto {
  id: string;
  name: string;
  description?: string;
  storeId: string;
  createdAt: Date;
  updatedAt: Date;
  permissions?: { permissionId: string; permission: { name: string } }[];
  constructor(client: Client) {
    Object.assign(this, client);
  }
}
