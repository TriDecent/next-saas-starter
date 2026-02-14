'use client';

import { OrgContext, type OrgContextValue } from './org-context';

export function OrgContextProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: OrgContextValue;
}) {
  return <OrgContext value={value}>{children}</OrgContext>;
}
