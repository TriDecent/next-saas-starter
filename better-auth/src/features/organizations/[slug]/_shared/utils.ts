import { format } from 'date-fns';

export function formatDate(date: Date) {
  return format(date, 'MMM dd, yyyy');
}

export function getInitials(name: string) {
  const n = name.trim();
  if (!n) return 'U';

  const parts = n.split(/\s+/).slice(0, 2);
  return parts.map(p => p[0]?.toUpperCase()).join('');
}
