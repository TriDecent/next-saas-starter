import { createContext } from 'react';

export type RouteContextValue = { callbackUrl: string };

export const RouteContext = createContext<RouteContextValue | null>(null);
