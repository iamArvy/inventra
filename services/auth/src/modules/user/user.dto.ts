import { User } from 'generated/prisma';

export class UserDto {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  roleId: string;
  storeId: string;
  createdAt: Date;

  constructor(user: User) {
    Object.assign(this, user);
  }
}

export class UserList {
  users: UserDto[];
}
