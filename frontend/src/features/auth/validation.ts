import type { AuthCredentials } from '@/lib/api';

export type AuthField = keyof AuthCredentials;
export type AuthFieldErrors = Partial<Record<AuthField, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_ALLOWED_PATTERN = /^[A-Za-z0-9@$!%*?&._-]+$/;

export function validateCredentials(
  credentials: AuthCredentials,
): AuthFieldErrors {
  const errors: AuthFieldErrors = {};
  const email = credentials.email.trim();

  if (!email) {
    errors.email = '请输入电子邮箱';
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = '请输入有效的电子邮箱格式';
  }

  if (!credentials.password) {
    errors.password = '请输入密码';
  } else if (credentials.password.length < 8) {
    errors.password = '密码至少需要 8 个字符';
  } else if (credentials.password.length > 72) {
    errors.password = '密码不能超过 72 个字符';
  } else if (!PASSWORD_ALLOWED_PATTERN.test(credentials.password)) {
    errors.password = '密码包含不支持的字符';
  } else if (!/[A-Za-z]/.test(credentials.password)) {
    errors.password = '密码必须包含至少一个英文字母';
  } else if (!/[0-9]/.test(credentials.password)) {
    errors.password = '密码必须包含至少一个数字';
  } else if (!/[@$!%*?&._-]/.test(credentials.password)) {
    errors.password = '密码必须包含至少一个特殊字符';
  }

  return errors;
}
