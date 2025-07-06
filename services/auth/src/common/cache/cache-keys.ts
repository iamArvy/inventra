export const CacheKeys = {
  storeRoles: (storeId: string) => `roles:${storeId}`,
  role: (storeId: string) => `role:${storeId}`,
  userPermissions: (userId: string, storeId: string) =>
    `permissions:${storeId}:${userId}`,
  rolePermissions: (roleId: string) => `role_permissions:${roleId}`,
  // add more as needed
};
