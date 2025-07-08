// import { PartialType } from "@nestjs/mapped-types";

export class IdDataInput<T> {
  id: string;
  data: T;
}

export class IdStoreDataInput<T> extends IdDataInput<T> {
  storeId: string;
}

export class EmailInput {
  email: string;
}

export class TokenInput {
  token: string;
}

export class IdInput {
  id: string;
}

export class PermissionsOperations {
  id: string;
  storeId: string;
  permissions: string[];
}
