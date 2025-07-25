import { Brackets, ObjectLiteral, Repository } from 'typeorm';

export interface IQuery {
  limit?: number;
  pageIndex?: number;
  searchIn?: string[];
  search?: string;
  filter?: Record<string, any>;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export class QueryUtil<T extends ObjectLiteral> {
  private readonly query: IQuery;
  private readonly repo: Repository<T>;

  constructor(repo: Repository<T>, query: IQuery, alias = 'item') {
    this.repo = repo;
    this.query = query;
    alias = alias;
  }

  async find(): Promise<{
    limit: number;
    pageIndex: number;
    items: T[];
    totalItems: number;
  }> {
    const alias = this.repo.metadata.name.toLowerCase();

    if (!this.query.searchIn) {
      this.query.searchIn = [];
    }
    const qb = this.repo.createQueryBuilder(alias);

    // Default pagination
    const limit = this.query.limit || 10;
    const pageIndex = this.query.pageIndex || 0;
    const skip = limit * pageIndex;

    // Search
    if (this.query.search && this.query.searchIn?.length) {
      qb.andWhere(
        new Brackets(qb1 => {
          // @ts-ignore
          for (const field of this.query.searchIn) {
            qb1.orWhere(`LOWER(${alias}.${field}) LIKE LOWER(:search)`, {
              search: `%${this.query.search}%`
            });
          }
        })
      );
    }

    if (this.query.filter) {
      const columns = this.repo.metadata.columns.map(col => col.propertyName);
      const relations = this.repo.metadata.relations.map(r => r.propertyName);

      for (const [key, value] of Object.entries(this.query.filter)) {
        if (value === undefined || value === null) continue;

        let operator = '=';
        let field = key;

        if (key.endsWith('_min')) {
          operator = '>=';
          field = key;
        } else if (key.endsWith('_max')) {
          operator = '<=';
          field = key;
        }

        // Smart check: only replace _ with . if prefix is a relation
        const parts = field.split('_');
        if (parts.length === 2 && relations.includes(parts[0])) {
          const relationName = parts[0];
          const columnName = parts[1];
          const param = key;
          qb.andWhere(`${relationName}.${columnName} ${operator} :${param}`, {
            [param]: value
          });
          continue;
        }

        // Field is in main entity
        if (columns.includes(field)) {
          if (Array.isArray(value)) {
            qb.andWhere(`${alias}.${field} IN (:...${key})`, { [key]: value });
          } else {
            qb.andWhere(`${alias}.${field} ${operator} ${value}`, { [key]: value });
          }
        }
      }
    }

    for (const relation of this.repo.metadata.relations) {
      qb.leftJoinAndSelect(`${alias}.${relation.propertyName}`, relation.propertyName);
    }

    // Sort
    const sortBy = this.query.sortBy || `${alias}.id`;
    const order = this.query.order === 'asc' ? 'ASC' : 'DESC';
    qb.orderBy(sortBy, order);

    // Pagination
    qb.skip(skip).take(limit);
    const [items, totalItems] = await qb.getManyAndCount();

    return {
      items,
      totalItems,
      limit,
      pageIndex
    };
  }
}
