import { DeleteAccountButton } from './DeleteAccountButton';
import { SendDeleteAccountButton } from './SendDeleteAccountButton';

export function DeleteAccountFlow({ token }: { token?: string }) {
  return !!token ? (
    <DeleteAccountButton token={token} />
  ) : (
    <SendDeleteAccountButton />
  );
}
