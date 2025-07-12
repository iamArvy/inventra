// common/pipes/user-by-id.pipe.ts
import { PipeTransform, Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'generated/prisma';
import { UserRepo } from 'src/db/repositories/user.repo';

@Injectable()
export class UserByIdPipe implements PipeTransform<string, Promise<User>> {
  constructor(private readonly repo: UserRepo) {}

  async transform(userId: string): Promise<User> {
    const user = await this.repo.findById(userId);
    if (!user) throw new NotFoundException(`User with id "${userId} not found`);
    return user;
  }
}
