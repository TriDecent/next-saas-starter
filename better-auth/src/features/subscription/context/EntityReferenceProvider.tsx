'use client';

import {
  EntityReferenceContext,
  type EntityReferenceContextType,
} from './EntityReferenceContext';

export function EntityReferenceProvider({
  value,
  children,
}: {
  value: EntityReferenceContextType;
  children: React.ReactNode;
}) {
  return (
    <EntityReferenceContext value={value}>{children}</EntityReferenceContext>
  );
}
