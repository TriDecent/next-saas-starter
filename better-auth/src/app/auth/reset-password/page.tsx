import { ResetPasswordCard } from '@/features/auth/reset-password';
import { ROUTES } from '@/features/shared/constants';
import type { Metadata } from 'next';

export const metadata: Metadata = ROUTES.auth.nested['reset-password'].metadata;

export default function ResetPasswordPage() {
  return <ResetPasswordCard />;
}
