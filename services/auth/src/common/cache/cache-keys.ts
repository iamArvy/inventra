export const CacheKeys = {
  storeRoles: (storeId: string) => `roles:${storeId}`,
  role: (storeId: string) => `role:${storeId}`,
  rolePermissions: (roleId: string) => `role_permissions:${roleId}`,
  permissions: 'permissions',
  permission: (permissionId: string) => `permission:${permissionId}`,
  client: (clientId: string) => `client:${clientId}`,
  storeClients: (storeId: string) => `clients:${storeId}`,
  clientPermissions: (clientId: string) => `client_permissions:${clientId}`,
  // add more as needed
};
