import { format } from 'date-fns';
import type { MySubscription } from '../types';

export function getStatusVariant(status: MySubscription['status']) {
  switch (status) {
    case 'active':
      return 'success' as const;
    case 'trialing':
      return 'warning' as const;
    case 'past_due':
    case 'unpaid':
      return 'error' as const;
    case 'canceled':
    case 'incomplete_expired':
      return 'destructive' as const;
    default:
      return 'secondary' as const;
  }
}

export function toReadableLabel(value: string) {
  return toTitleCase(value.replaceAll('_', ' '));
}

export function toTitleCase(value: string) {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map(word => word[0]!.toUpperCase() + word.slice(1))
    .join(' ');
}

export function formatDate(date?: Date) {
  return date ? format(date, 'MMM dd, yyyy') : 'N/A';
}

export function formatDateRange(start?: Date, end?: Date) {
  return start && end ? 'N/A' : `${formatDate(start)} - ${formatDate(end)}`;
}

export function compactId(id?: string) {
  if (!id) return 'N/A';

  return id.length <= 16 ? id : `${id.slice(0, 8)}...${id.slice(-6)}`;
}
