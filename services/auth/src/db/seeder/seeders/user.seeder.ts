import { Injectable, Logger } from '@nestjs/common';
import { UserRepo, RoleRepo } from 'src/db/repository';
import * as argon from 'argon2';

@Injectable()
export class UserSeeder {
  private readonly logger = new Logger(UserSeeder.name);
  constructor(
    private readonly user: UserRepo,
    private readonly role: RoleRepo,
  ) {}

  async seed() {
    const role = await this.role.create({
      name: 'testrole',
      storeId: 'storeId',
    });
    const users = [
      {
        name: 'Test User',
        email: 'testemail@gmail.com',
        passwordHash: await argon.hash('testpassword'),
        emailVerified: true,
        storeId: 'storeId',
        roleId: role.id,
      },
    ];
    await this.user.createMany(users);
    return this.logger.log('Users Created successfully');
  }
}
