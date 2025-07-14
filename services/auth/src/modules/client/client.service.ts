import { Injectable, Logger } from '@nestjs/common';
import { ClientRepo } from 'src/db/repository';
import { ClientInput } from './client.inputs';
import { randomBytes } from 'crypto';
import { SecretService } from 'src/common/services/secret/secret.service';
import { ClientDto, ClientList, Secret } from './client.dto';
import { Status } from 'src/common/dto/app.response';
import { Client } from 'generated/prisma';

@Injectable()
export class ClientService {
  constructor(
    private repo: ClientRepo,
    private secretService: SecretService,
  ) {}

  protected readonly logger = new Logger(this.constructor.name);

  generateSecret() {
    return randomBytes(32).toString('hex'); // 64-char hex string
  }
  // create client
  async create(
    storeId: string,
    data: ClientInput,
    permissions: string[],
  ): Promise<Client> {
    // Validate storeId and data
    if (!storeId || !data) {
      throw new Error('Store ID and client data are required');
    }
    const secret = this.generateSecret();
    const hashedSecret = await this.secretService.create(secret);
    const client = await this.repo.create({
      storeId,
      hashedSecret,
      ...data,
    });
    if (!client) {
      throw new Error('Failed to create client');
    }
    this.logger.log(
      `Client created with ID: ${client.id} in store: ${storeId}`,
      'ClientService.create',
    );
    if (permissions && permissions.length > 0) {
      await this.repo.attachPermissions(client.id, permissions);
    }
    // Create event which will email the secret
    return client;
  }

  // update client
  async update(
    id: string,
    storeId: string,
    data: Partial<ClientInput>,
  ): Promise<Status> {
    if (!id || !storeId || !data) {
      throw new Error('ID, store ID, and client data are required');
    }
    const client = await this.repo.findByIdOrThrow(id);
    if (client.storeId !== storeId) {
      throw new Error('Client does not belong to the specified store');
    }
    const update = await this.repo.update(id, data);
    if (!update) throw new Error('Failed to update client');
    this.logger.log(
      `Client updated with ID: ${client.id} in store: ${storeId}`,
      'ClientService.update',
    );
    return { success: true };
  }

  // generate secret
  async refreshSecret(id: string): Promise<Secret> {
    // Validate id
    const client = await this.repo.findByIdOrThrow(id);
    const secret = this.generateSecret();
    const hashedSecret = await this.secretService.create(secret);
    const updatedClient = await this.repo.update(client.id, { hashedSecret });
    if (!updatedClient) {
      throw new Error('Failed to update client secret');
    }
    this.logger.log(
      `Client secret refresh for ID: ${client.id}`,
      'ClientService.refreshSecret',
    );
    return { secret };
  }

  async list(storeId: string): Promise<ClientList> {
    const clients = await this.repo.list(storeId);
    if (!clients || clients.length === 0) {
      throw new Error('No clients found for the specified store');
    }
    this.logger.log(
      `Clients listed for store ID: ${storeId}`,
      'ClientService.list',
    );
    return { clients };
  }

  async get(id: string) {
    if (!id) {
      throw new Error('Client not found');
    }
    const client = await this.repo.findByIdOrThrow(id);
    this.logger.log(
      `Client retrieved with ID: ${client.id}`,
      'ClientService.get',
    );
    return new ClientDto(client);
  }

  async attachPermissions(id: string, permissions: string[]) {
    const client = await this.repo.findByIdOrThrow(id);

    if (!id || !permissions || permissions.length === 0) {
      throw new Error('Client and permissions are required');
    }

    const updatedClient = await this.repo.attachPermissions(id, permissions);
    if (!updatedClient) {
      throw new Error('Failed to attach permissions to client');
    }
    this.logger.log(
      `Permissions attached to client ID: ${client.id}`,
      'ClientService.attachPermissions',
    );

    return { success: true };
  }

  async detachPermissions(id: string, permissions: string[]) {
    if (!id || !permissions || permissions.length === 0) {
      throw new Error('Client ID and permissions are required');
    }
    const client = await this.repo.findByIdOrThrow(id);

    const updatedClient = await this.repo.detachPermissions(id, permissions);
    if (!updatedClient) {
      throw new Error('Failed to detach permissions from client');
    }
    this.logger.log(
      `Permissions detached from client ID: ${client.id}`,
      'ClientService.detachPermissions',
    );

    return { success: true };
  }

  async delete(id: string) {
    // Validate id
    if (!id) {
      throw new Error('Client ID is required');
    }
    const client = await this.repo.findByIdOrThrow(id);

    const deletedClient = await this.repo.delete(id);
    if (!deletedClient) {
      throw new Error('Failed to delete client');
    }
    this.logger.log(
      `Client deleted with ID: ${client.id}`,
      'ClientService.delete',
    );
    return { success: true };
  }
}
