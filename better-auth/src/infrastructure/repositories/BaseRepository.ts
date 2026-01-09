interface BaseDelegate {
  create(args: unknown): Promise<unknown>;
  findUnique(args: unknown): Promise<unknown>;
  findMany(args: unknown): Promise<unknown>;
  update(args: unknown): Promise<unknown>;
  delete(args: unknown): Promise<unknown>;
  count(args: unknown): Promise<unknown>;
}

export interface IBaseRepository<D extends BaseDelegate> {
  findUnique(
    args: Parameters<D['findUnique']>[0]
  ): Promise<ReturnType<D['findUnique']>>;
  findMany(
    args?: Parameters<D['findMany']>[0]
  ): Promise<ReturnType<D['findMany']>>;
  create(args: Parameters<D['create']>[0]): Promise<ReturnType<D['create']>>;
  update(args: Parameters<D['update']>[0]): Promise<ReturnType<D['update']>>;
  delete(args: Parameters<D['delete']>[0]): Promise<ReturnType<D['delete']>>;
  count(args: Parameters<D['count']>[0]): Promise<ReturnType<D['count']>>;
}

export abstract class BaseRepository<D extends BaseDelegate>
  implements IBaseRepository<D>
{
  constructor(protected readonly delegate: D) {}

  async findUnique(
    args: Parameters<D['findUnique']>[0]
  ): Promise<ReturnType<D['findUnique']>> {
    return this.delegate.findUnique(args) as ReturnType<D['findUnique']>;
  }

  async findMany(
    args?: Parameters<D['findMany']>[0]
  ): Promise<ReturnType<D['findMany']>> {
    return this.delegate.findMany(args) as ReturnType<D['findMany']>;
  }

  async create(
    args: Parameters<D['create']>[0]
  ): Promise<ReturnType<D['create']>> {
    return this.delegate.create(args) as ReturnType<D['create']>;
  }

  async update(
    args: Parameters<D['update']>[0]
  ): Promise<ReturnType<D['update']>> {
    return this.delegate.update(args) as ReturnType<D['update']>;
  }

  async delete(
    args: Parameters<D['delete']>[0]
  ): Promise<ReturnType<D['delete']>> {
    return this.delegate.delete(args) as ReturnType<D['delete']>;
  }

  async count(
    args: Parameters<D['count']>[0]
  ): Promise<ReturnType<D['count']>> {
    return this.delegate.count(args) as ReturnType<D['count']>;
  }
}
