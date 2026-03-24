'use client';

import { RouteContext, type RouteContextValue } from './route-context';

export function RouteContextProvider({
  value,
  children,
}: {
  value: RouteContextValue;
  children: React.ReactNode;
}) {
  return <RouteContext value={value}>{children}</RouteContext>;
}
