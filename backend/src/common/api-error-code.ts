export const ApiErrorCode = {
  validation: 'VALIDATION_ERROR',
  emailExists: 'AUTH_EMAIL_EXISTS',
  userNotFound: 'AUTH_USER_NOT_FOUND',
  invalidPassword: 'AUTH_INVALID_PASSWORD',
  invalidSession: 'AUTH_INVALID_SESSION',
} as const;
