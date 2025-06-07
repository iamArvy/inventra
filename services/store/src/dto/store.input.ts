import { PartialType } from '@nestjs/mapped-types';
export class CreateStoreInput {
  ownerId: string;
  data: StoreData;
}

export class StoreData {
  name: string;
  description: string;
  location: string;
  website?: string;
  email?: string;
  phone?: string;
}
export class PartialStoreData extends PartialType(StoreData) {}

export class UpdateStoreInput {
  ownerId: string;
  data: PartialStoreData;
}
