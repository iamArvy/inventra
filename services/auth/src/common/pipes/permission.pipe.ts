// common/pipes/user-by-id.pipe.ts
import { status } from '@grpc/grpc-js';
import { PipeTransform, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Permission } from 'generated/prisma';
import { PermissionRepo } from 'src/db/repository/repositories/permission.repo';

@Injectable()
export class PermissionPipe
  implements PipeTransform<string, Promise<Permission>>
{
  constructor(private readonly repo: PermissionRepo) {}

  async transform(userId: string): Promise<Permission> {
    console.log(userId);
    const permission = await this.repo.findById(userId);
    if (!permission)
      throw new RpcException({
        code: status.NOT_FOUND,
        message: `User not found`,
      });
    return permission;
  }
}
