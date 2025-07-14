// common/pipes/user-by-id.pipe.ts
import { status } from '@grpc/grpc-js';
import { PipeTransform, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Client } from 'generated/prisma';
import { ClientRepo } from 'src/db/repository/repositories/client.repo';

@Injectable()
export class ClientPipe implements PipeTransform<string, Promise<Client>> {
  constructor(private readonly repo: ClientRepo) {}

  async transform(id: string): Promise<Client> {
    // console.log(userId);
    const client = await this.repo.findById(id);
    if (!client)
      throw new RpcException({
        code: status.NOT_FOUND,
        message: `User not found`,
      });
    return client;
  }
}
