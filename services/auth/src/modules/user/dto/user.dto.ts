import { User } from 'generated/prisma';

export class UserDto {
  id: string;
  name: string;
  email: string;
  roleId: string;
  storeId: string;
  createdAt: string;

  constructor(user: User) {
    Object.assign(this, user);
  }
}
