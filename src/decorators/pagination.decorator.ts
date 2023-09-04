import dataSource from "../config/typeorm.config";
import { camelCase } from "typeorm/util/StringUtils";
import { QueryCollateralTypeDto } from "../generalUtils/global.dtos";
import { RelationFilter, RepoSelect } from "../generalUtils/interfaces";

export function paginate(repo: RepoSelect, relations: RelationFilter[] = [], loadRelationIds = false) {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {

      console.log(repo.table.toString());

      const query: QueryCollateralTypeDto = args[0];
      const isInitialized = dataSource.isInitialized;
      if (!isInitialized) await dataSource.initialize();

      const builder = dataSource
        .getRepository(repo.table)
        .createQueryBuilder();
      if (repo.select)
        builder.select(repo.select.map((s) => `${repo.table}.${s}`));

      relations.forEach((relation) => {
        builder.leftJoinAndSelect(`relation.table`, relation.table.toString(), relation.on);
        if (relation.select)
          builder.addSelect(relation.select.map((s) => `${relation.table.toString()}.${s}`));
      });

      if (query.sortBy)
        builder.orderBy(`${repo.table}.${query.sortBy}`, query.sortOrder);
      if (query.sortOrder)
        builder.orderBy(`${repo.table}.${query.sortBy}`, query.sortOrder);

      builder.limit(query.limit).offset((query.page - 1) * query.limit);

      const results = await builder.getManyAndCount();


      return {
        data: {
          total: results[1],
          [camelCase(repo.toString())]: results[0],
        },
      };
    };
    return descriptor;
  };
}