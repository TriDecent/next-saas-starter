import { getAuthService } from '@/infrastructure/service';
import { UserDropdownNav } from './UserDropdownNav';

export async function RenderUserDropdownNav() {
  const actor = (await getAuthService()).actor;

  return actor ? (
    <UserDropdownNav user={actor} size={'sm'} align='end' />
  ) : null;
}
