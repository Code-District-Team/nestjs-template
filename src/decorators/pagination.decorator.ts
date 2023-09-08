import dataSource from "../config/typeorm.config";
import { camelCase } from "typeorm/util/StringUtils";
import { QueryCollateralTypeDto } from "../generalUtils/global.dtos";
import { RelationFilter, RepoSelect } from "../generalUtils/interfaces";

export function paginate(repo: RepoSelect, relations: RelationFilter[] = []) {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {

      const query: QueryCollateralTypeDto = args[0];
      const isInitialized = dataSource.isInitialized;
      if (!isInitialized) await dataSource.initialize();

      const repository = dataSource.getRepository(repo.table);
      const tableName = repository.metadata.tableName;

      const builder = repository.createQueryBuilder(tableName);
      if (repo.select)
        builder.select(repo.select.map((s: string) => `${tableName}.${s}`));

      relations.forEach((relation) => {
        if (relation.joinType === "inner")
          builder.innerJoin(relation.property, relation.alias, relation.condition, relation.parameters);
        else
          builder.leftJoin(relation.property, relation.alias, relation.condition, relation.parameters);
        if (relation.select)
          builder.addSelect(relation.select.map((s) => s));
      });

      if (query.query) // ILIKE
        builder.where(`${tableName}.name ILIKE :query`, { query: `%${query.query}%` });

      if (query.sortBy)
        builder.orderBy(`${tableName}.${query.sortBy}`, query.sortOrder);
      if (query.sortOrder)
        builder.orderBy(`${tableName}.${query.sortBy}`, query.sortOrder);

      builder.limit(query.limit).offset((query.page - 1) * query.limit);

      const results = await builder.getManyAndCount();


      return {
        data: {
          total: results[1],
          [camelCase(tableName)]: results[0],
        },
      };
    };
    return descriptor;
  };
}