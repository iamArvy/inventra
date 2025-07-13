// common/pipes/user-by-id.pipe.ts
import { status } from '@grpc/grpc-js';
import { PipeTransform, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { User } from 'generated/prisma';
import { UserRepo } from 'src/db/repositories/user.repo';

@Injectable()
export class UserPipe implements PipeTransform<string, Promise<User>> {
  constructor(private readonly repo: UserRepo) {}

  async transform(userId: string): Promise<User> {
    console.log(userId);
    const user = await this.repo.findById(userId);
    if (!user)
      throw new RpcException({
        code: status.NOT_FOUND,
        message: `User not found`,
      });
    return user;
  }
}
