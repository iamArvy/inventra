export class CreateStoreInput {
  name: string;
  owner_id: string;
  category_id: string;
  description: string;
  location: string;
  website?: string;
  email?: string;
  phone?: string;
}
