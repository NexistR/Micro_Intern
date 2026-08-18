import type { Metadata } from 'next';
import AuthForm from '@/components/auth/AuthForm';

export const metadata: Metadata = {
  title: '登录 | Workspace',
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
