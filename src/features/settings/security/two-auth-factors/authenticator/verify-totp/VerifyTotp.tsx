import { VerifyTotpForm } from './VerifyTotpForm';

export function VerifyTotp({
  onVerifySuccess,
}: {
  onVerifySuccess: () => void;
}) {
  return <VerifyTotpForm onFormSuccess={onVerifySuccess} />;
}
