type Paths<T> = T extends object
  ? {
      [K in keyof T]:
        | `${Exclude<K, symbol>}`
        | `${Exclude<K, symbol>}.${Paths<T[K]>}`;
    }[keyof T]
  : never;

type PathValue<T, P extends Paths<T>> = P extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? Rest extends Paths<T[Key]>
      ? PathValue<T[Key], Rest>
      : never
    : never
  : P extends keyof T
    ? T[P]
    : never;

export type StrictPhantom<T, P extends Paths<T>> = {
  [K in P]?: PathValue<T, K>;
};
export type AutoStrictPhantom<T> = {
  [K in Paths<T>]?: PathValue<T, K>;
};
