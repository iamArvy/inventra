import { PipeTransform, Injectable, Inject, forwardRef } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

export interface FindByIdRepo<T> {
  findById(id: string): Promise<T | null>;
}

@Injectable()
export class IdPipe<T> implements PipeTransform<string, Promise<T>> {
  constructor(
    @Inject(forwardRef(() => 'REPO_TOKEN')) // <- we’ll register this token later
    private readonly repo: FindByIdRepo<T>,
  ) {}

  async transform(id: string): Promise<T> {
    const item = await this.repo.findById(id);
    if (!item) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: `Resource with id: ${id} not found`,
      });
    }
    return item;
  }
}
