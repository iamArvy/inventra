export class UserData {
  name: string;
  email: string;
}
export class CreateUserInput {
  id: string;
  data: UserData;
  roleId: string;
}

export class DeleteUserInput {
  id: string;
  storeId: string;
}
