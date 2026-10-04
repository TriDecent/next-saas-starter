export function lazySingleton<T extends object>(factory: () => T): T {
  let instance: T | null = null;

  return new Proxy({} as T, {
    get(_, prop: string | symbol, receiver: unknown) {
      if (!instance) {
        instance = factory();
      }

      const value = Reflect.get(instance, prop, receiver);

      if (typeof value === 'function') return value.bind(instance);

      return value;
    },
  });
}
