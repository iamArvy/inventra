import { PartialType } from '@nestjs/mapped-types';
import { Store } from 'generated/prisma';

export class StoreData {
  name: string;
  description: string;
  location?: string;
  website?: string;
  email: string;
  phone: string;
}

export class CreateStoreInput extends StoreData {}

export class PartialStoreData extends PartialType(StoreData) {}

export class UpdateStoreInput {
  id: string;
  data: PartialStoreData;
}

export class StoreDto {
  id: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  logo_url: string | null;
  description: string | null;
  location: string | null;
  website: string | null;
  phone: string | null;
  email: string | null;
  created_at: Date;

  constructor(store: Store) {
    Object.assign(this, store);
  }
}

export class UserList {
  stores: StoreDto[];
}
