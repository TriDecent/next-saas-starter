'use client';

import { use } from 'react';
import { RouteContext } from './route-context';

export function useRouteContext() {
  const context = use(RouteContext);
  if (!context)
    throw new Error(
      'useRouteContext must be used within a RouteContextProvider'
    );

  return context;
}
