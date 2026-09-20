import type { StrictEndpoint, z } from 'better-auth';

export type ServiceResponse<TSuccess, TError> =
  | { type: 'success'; payload: TSuccess }
  | { type: 'error'; payload: TError };

export type ExtractEndpointBody<T> =
  T extends StrictEndpoint<string, infer Req, unknown>
    ? Req extends { body: infer B }
      ? z.infer<B>
      : never
    : never;

export type ExtractEndpointQuery<T> =
  T extends StrictEndpoint<string, infer Req, unknown>
    ? Req extends { query: infer B }
      ? z.infer<B>
      : never
    : never;
