export const mockProductRepo = {
  create: jest.fn(),
  findById: jest.fn(),
  findByIdOrThrow: jest.fn(),
  findByIdWithRelationships: jest.fn(),
  find: jest.fn(),
  listByStore: jest.fn(),
  listByCategory: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};
