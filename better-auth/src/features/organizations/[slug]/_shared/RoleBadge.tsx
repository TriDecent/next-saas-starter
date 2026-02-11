import { Badge } from '@/shared/components/ui';

export function RoleBadge({ role }: { role: string }) {
  const variant = role.includes('owner')
    ? 'default'
    : role.includes('super-admin')
      ? 'destructive'
      : role.includes('admin')
        ? 'secondary'
        : 'outline';

  return (
    <Badge variant={variant} className='capitalize'>
      {role}
    </Badge>
  );
}
