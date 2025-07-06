export const CacheKeys = {
  storeRoles: (storeId: string) => `roles:${storeId}`,
  role: (storeId: string) => `role:${storeId}`,
  rolePermissions: (roleId: string) => `role_permissions:${roleId}`,
  permissions: 'permissions',
  permission: (permissionId: string) => `permission:${permissionId}`,
  // add more as needed
};
