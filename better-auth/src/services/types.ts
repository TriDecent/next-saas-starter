export type ServiceResponse<TSuccess, TError> =
  | { type: 'success'; payload: TSuccess }
  | { type: 'error'; payload: TError };
