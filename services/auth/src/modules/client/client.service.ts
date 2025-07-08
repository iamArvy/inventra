import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/services/base/base.service';
import { ClientRepo } from 'src/db/repositories/client.repo';
import { ClientData } from './dto/client.inputs';
import { randomBytes } from 'crypto';
import { SecretService } from 'src/common/services/secret/secret.service';
import { ClientDto } from './dto/client.dto';
import { CacheKeys } from 'src/cache/cache-keys';
import { CacheService } from 'src/cache/cache.service';

@Injectable()
export class ClientService extends BaseService {
  constructor(
    private repo: ClientRepo,
    private secretService: SecretService,
    private readonly cache: CacheService,
  ) {
    super();
  }

  generateSecret() {
    return randomBytes(32).toString('hex'); // 64-char hex string
  }
  // create client
  async create(storeId: string, data: ClientData) {
    try {
      // Validate storeId and data
      if (!storeId || !data) {
        throw new Error('Store ID and client data are required');
      }
      const secret = this.generateSecret();
      const hashedSecret = await this.secretService.create(secret);
      const client = await this.repo.create({ storeId, hashedSecret, ...data });
      if (!client) {
        throw new Error('Failed to create client');
      }
      this.logger.log(
        `Client created with ID: ${client.id} in store: ${storeId}`,
        'ClientService.create',
      );
      return client;
    } catch (error) {
      this.handleError(error, 'ClientService.create');
    }
  }

  // update client
  async update(id: string, storeId: string, data: Partial<ClientData>) {
    try {
      // Validate id, storeId, and data
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
    } catch (error) {
      this.handleError(error, 'ClientService.create');
    }
  }

  // generate secret
  async refreshSecret(id: string) {
    try {
      // Validate id
      if (!id) {
        throw new Error('Client ID is required');
      }
      const client = await this.repo.findByIdOrThrow(id);
      const secret = this.generateSecret();
      const hashedSecret = await this.secretService.create(secret);
      const updatedClient = await this.repo.update(id, { hashedSecret });
      if (!updatedClient) {
        throw new Error('Failed to update client secret');
      }
      this.logger.log(
        `Client secret refresh for ID: ${client.id}`,
        'ClientService.refreshSecret',
      );
      return { secret };
    } catch (error) {
      this.handleError(error, 'ClientService.create');
    }
  }

  // list client
  async list(storeId: string) {
    try {
      // Validate storeId
      if (!storeId) {
        throw new Error('Store ID is required');
      }
      const cachedClients = await this.cache.get<ClientDto[]>(
        CacheKeys.storeClients(storeId),
      );

      if (cachedClients) {
        this.logger.log(
          `Clients retrieved from cache for store ID: ${storeId}`,
          'ClientService.list',
        );
        return cachedClients;
      }
      const clients = await this.repo.list(storeId);
      if (!clients || clients.length === 0) {
        throw new Error('No clients found for the specified store');
      }
      this.logger.log(
        `Clients listed for store ID: ${storeId}`,
        'ClientService.list',
      );
      return clients;
    } catch (error) {
      this.handleError(error, 'ClientService.create');
    }
  }

  // get client
  async get(id: string) {
    try {
      // Validate id
      if (!id) {
        throw new Error('Client ID is required');
      }
      const cachedClient = await this.cache.get<ClientDto>(
        CacheKeys.client(id),
      );
      if (cachedClient) {
        this.logger.log(
          `Client retrieved from cache with ID: ${id}`,
          'ClientService.get',
        );
        return cachedClient;
      }
      const client = await this.repo.findByIdOrThrow(id);
      if (!client) {
        throw new Error('Client not found');
      }
      this.logger.log(
        `Client retrieved with ID: ${client.id}`,
        'ClientService.get',
      );
      await this.cache.set(CacheKeys.client(id), new ClientDto(client), '1h');
      return new ClientDto(client);
    } catch (error) {
      this.handleError(error, 'ClientService.create');
    }
  }

  // attach permissions
  async attachPermissions(id: string, permissions: string[]) {
    try {
      // Validate id and permissions
      if (!id || !permissions || permissions.length === 0) {
        throw new Error('Client ID and permissions are required');
      }
      const client = await this.repo.findByIdOrThrow(id);
      if (!client) {
        throw new Error('Client not found');
      }

      const updatedClient = await this.repo.attachPermissions(id, permissions);
      if (!updatedClient) {
        throw new Error('Failed to attach permissions to client');
      }
      this.logger.log(
        `Permissions attached to client ID: ${client.id}`,
        'ClientService.attachPermissions',
      );

      await this.cache.delete(CacheKeys.clientPermissions(id)); // Clear cache for this client
      return { success: true };
    } catch (error) {
      this.handleError(error, 'ClientService.create');
    }
  }

  // detach permissions
  async detachPermissions(id: string, permissions: string[]) {
    try {
      // Validate id and permissions
      if (!id || !permissions || permissions.length === 0) {
        throw new Error('Client ID and permissions are required');
      }
      const client = await this.repo.findByIdOrThrow(id);
      if (!client) {
        throw new Error('Client not found');
      }

      const updatedClient = await this.repo.detachPermissions(id, permissions);
      if (!updatedClient) {
        throw new Error('Failed to detach permissions from client');
      }
      this.logger.log(
        `Permissions detached from client ID: ${client.id}`,
        'ClientService.detachPermissions',
      );

      await this.cache.delete(CacheKeys.clientPermissions(id)); // Clear cache for this client
      return { success: true };
    } catch (error) {
      this.handleError(error, 'ClientService.create');
    }
  }

  // delete client
  async delete(id: string) {
    try {
      // Validate id
      if (!id) {
        throw new Error('Client ID is required');
      }
      const client = await this.repo.findByIdOrThrow(id);
      if (!client) {
        throw new Error('Client not found');
      }

      const deletedClient = await this.repo.delete(id);
      if (!deletedClient) {
        throw new Error('Failed to delete client');
      }
      this.logger.log(
        `Client deleted with ID: ${client.id}`,
        'ClientService.delete',
      );
      await this.cache.delete(CacheKeys.client(id)); // Clear cache for this client
      await this.cache.delete(CacheKeys.storeClients(client.storeId)); // Clear cache for store clients
      await this.cache.delete(CacheKeys.clientPermissions(id)); // Clear cache for client permissions
      return { success: true };
    } catch (error) {
      this.handleError(error, 'ClientService.create');
    }
  }
}
