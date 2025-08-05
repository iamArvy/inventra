// export enum NotificationEvents {
//   EMAIL_VERIFICATION = 'email.verification',
//   PASSWORD_RESET = 'password.reset',
//   USER_CREATED = 'user.created',
//   USER_UPDATED = 'user.updated',
//   USER_LOGOUT = 'user.logout',
//   USER_PROFILE_UPDATE = 'user.profile.update',
//   USER_DELETED = 'user.deleted',
//   USER_AUTHENTICATED = 'user.authenticated',
//   USER_EMAIL_VERIFIED = 'user.email_verified',
//   USER_PASSWORD_RESET = 'user.password_reset',
//   USER_PASSWORD_CHANGED = 'user.password_changed',
//   USER_ACCOUNT_LOCKED = 'user.account_locked',
//   USER_ACCOUNT_UNLOCKED = 'user.account_unlocked',
//   USER_ACCOUNT_SUSPENDED = 'user.account_suspended',
//   USER_ACCOUNT_REACTIVATED = 'user.account_reactivated',
//   USER_ROLE_ASSIGNED = 'user.role_assigned',
//   USER_ROLE_REMOVED = 'user.role_removed',
//   USER_PERMISSIONS_UPDATED = 'user.permissions_updated',
//   USER_PROFILE_PICTURE_UPDATED = 'user.profile_picture_updated',
//   USER_TWO_FACTOR_ENABLED = 'user.two_factor_enabled',
//   USER_TWO_FACTOR_DISABLED = 'user.two_factor_disabled',
//   USER_SESSION_CREATED = 'user.session.created',
//   USER_SESSION_DELETED = 'user.session.deleted',
//   USER_SESSION_EXPIRED = 'user.session.expired',
// }

export enum UserEvents {
  USER_CREATED = 'user.created',
  USER_UPDATED = 'user.updated',
  USER_DELETED = 'user.deleted',
  USER_PROFILE_UPDATED = 'user.profile.updated',
  USER_EMAIL_VERIFIED = 'user.email.verified',
  USER_EMAIL_VERIFICATION_REQUESTED = 'user.email.verification.requested',
  USER_AUTHENTICATED = 'user.authenticated',
  USER_PASSWORD_RESET_REQUESTED = 'user.password.reset.requested',
  USER_PASSWORD_RESET = 'user.password.reset',
  USER_PASSWORD_CHANGED = 'user.password.changed',
  USER_ACCOUNT_LOCKED = 'user.account.locked',
  USER_ACCOUNT_UNLOCKED = 'user.account.unlocked',
  USER_ACCOUNT_SUSPENDED = 'user.account.suspended',
  USER_ACCOUNT_REACTIVATED = 'user.account.reactivated',
  USER_ROLE_ASSIGNED = 'user.role.assigned',
  USER_ROLE_REMOVED = 'user.role.removed',
  USER_PERMISSIONS_UPDATED = 'user.permissions.updated',
  USER_PROFILE_PICTURE_UPDATED = 'user.profile_picture.updated',
  USER_TWO_FACTOR_ENABLED = 'user.two_factor.enabled',
  USER_TWO_FACTOR_DISABLED = 'user.two_factor.disabled',
  USER_SESSION_CREATED = 'user.session.created',
  USER_SESSION_DELETED = 'user.session.deleted',
  USER_SESSION_EXPIRED = 'user.session.expired',
  USER_NEW_DEVICE_LOGIN = 'user.new_device.login',
  USER_DEACTIVATED = 'user.deactivated',
}

export const Events = {
  ...UserEvents,
  EMAIL_VERIFICATION: 'email.verification',
  PASSWORD_RESET: 'password.reset',
};

// export const MessagingConstants = {
//   AUTH_EVENTS: NotificationEvents,
//   // Add other event categories as needed
// };
// export type NotificationEvent = keyof typeof NotificationEvents;
