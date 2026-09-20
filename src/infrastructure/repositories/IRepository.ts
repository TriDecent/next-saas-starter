export interface IRepository<T> {
  /**
   * Architectural trade-off: leaky abstraction.
   *
   * Exposes the underlying Prisma Delegate for direct access.
   *
   * Usage guidelines:
   * - Limit usage strictly to simple read operations such as lightweight lookups
   *   or existence checks where defining a dedicated repository method would
   *   introduce unnecessary complexity.
   * - Do not use for complex business logic or any write operations.
   *
   * Direct dependence on this property creates tight coupling between the
   * Service layer and Prisma.
   *
   * @deprecated
   * Prefer defining explicit repository methods (e.g., getIds, findBySlug)
   * to preserve encapsulation.
   */
  get model(): T;
}
