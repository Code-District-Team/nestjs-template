import dataSource from "../config/typeorm.config";
import { camelCase } from "typeorm/util/StringUtils";
import { ConditionQueryDto, QueryCollateralTypeDto } from "../generalUtils/global.dtos";
import { RelationFilter, RepoSelect } from "../generalUtils/interfaces";
import { Brackets, ColumnType, WhereExpressionBuilder } from "typeorm";
import { BadRequestException } from "@nestjs/common";
import { toYYYYMMDD } from "../generalUtils/helper";


function composeQuery(builder: WhereExpressionBuilder, index: number, field: string, condition: ConditionQueryDto, operator: "AND" | "OR" = "AND") {
  let expression: string, params: { [key: string]: string | Date };
  if (condition.filterType === "date")
    field = `DATE(${field})`;
  switch (condition.type) {
    case "contains":
      [expression, params] = [`${field} ILIKE :filter${index}`, { ['filter' + index]: `%${condition.filter}%` }];
      break;
    case "notContains":
      [expression, params] = [`${field} NOT ILIKE :filter${index}`, { ['filter' + index]: `%${condition.filter}%` }];
      break;
    case "equals":
      [expression, params] = [`${field} = :filter${index}`, {
        ['filter' + index]: `${
          condition.filterType === "date" ?
            // "2023-09-05T10:25:20.958Z"
            toYYYYMMDD(condition.dateFrom)
            : condition.filter}`
      }];
      break;
    case "notEqual":
      [expression, params] = [`${field} != :filter${index}`, {
        ['filter' + index]: `${
          condition.filterType === "date" ? toYYYYMMDD(condition.dateFrom) : condition.filter}`
      }];
      break;
    case "startsWith":
      [expression, params] = [`${field} ILIKE :filter${index}`, { ['filter' + index]: `${condition.filter}%` }];
      break;
    case "endsWith":
      [expression, params] = [`${field} ILIKE :filter${index}`, { ['filter' + index]: `%${condition.filter}` }];
      break;
    case "lessThan":
      [expression, params] = [`${field} < :filter${index}`, {
        ['filter' + index]: `${
          condition.filterType === "date" ? toYYYYMMDD(condition.dateFrom) : condition.filter}`
      }];
      break;
    case "lessThanOrEqual":
      [expression, params] = [`${field} <= :filter${index}`, { ['filter' + index]: `${condition.filter}` }];
      break;
    case "greaterThan":
      [expression, params] = [`${field} > :filter${index}`, {
        ['filter' + index]: `${
          condition.filterType === "date" ? toYYYYMMDD(condition.dateFrom) : condition.filter}`
      }];
      break;
    case "greaterThanOrEqual":
      [expression, params] = [`${field} >= :filter${index}`, { ['filter' + index]: `${condition.filter}` }];
      break;
    case "inRange":
      if (condition.dateFrom.toDateString() === condition.dateTo.toDateString()) {
        condition.dateTo.setHours(23, 59, 59, 999);
      }
      [expression, params] = [`${field} BETWEEN :dateFrom${index} AND :dateTo${index}`, {
        ['dateFrom' + index]: condition.dateFrom,
        ['dateTo' + index]: condition.dateTo
      }];
      break;
    case "empty":
      [expression, params] = [`${field} IS NULL`, undefined];
      break;
    case "notEmpty":
      [expression, params] = [`${field} IS NOT NULL`, undefined];
      break;
    default:
      return;
  }
  if (operator === "AND")
    builder.andWhere(expression, params);
  else
    builder.orWhere(expression, params);
}

export function PaginateEntity(repo: RepoSelect, relations: RelationFilter[] = []) {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {

      const query: QueryCollateralTypeDto = args[0];

      console.log(query.filters);
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


      if (query.query) {
        builder.where(`${tableName}.name ILIKE :query`, { query: `%${query.query}%` });
      }

      const columns = new Map<string, ColumnType>();
      repository.metadata.columns.forEach((column) => {
        columns.set(column.propertyName, column.type);
      });

      if (query.filterType === "ag-grid") {
        query.agGrid?.forEach((agGrid, index) => {
          const field = `${tableName}.${agGrid.field}`;
          const condition1 = agGrid.condition1;
          const condition2 = agGrid.condition2;

          if (!columns.has(agGrid.field))
            throw new BadRequestException(`Field ${agGrid.field} does not exist in ${tableName} table`);
          // check if requested type and actual type are the same
          if (condition1.filterType === "date" && columns.get(agGrid.field) !== "timestamp")
            throw new BadRequestException(`Field ${agGrid.field} is not of type date`);
          // else if (condition1.filterType === "number" && columns.get(agGrid.field) !== "number")
          //   throw new BadRequestException(`Field ${agGrid.field} is not of type number`);
          // else if (condition1.filterType === "text" && columns.get(agGrid.field) !== "string")
          //   throw new BadRequestException(`Field ${agGrid.field} is not of type text`);

          if (condition2) {
            builder.andWhere(new Brackets((qb) => {
              composeQuery(qb, index, field, condition1);
              composeQuery(qb, index + 1000, field, condition2, agGrid.operator);
            }));
          } else {
            composeQuery(builder, index, field, condition1);
          }
        });
      } else if (query.filters) {
        const keys = Object.keys(query.filters);
        keys.forEach((key, index) => {
          if (!query.filters[key]) return;
          if (!columns.has(key))
            throw new BadRequestException(`Field ${key} does not exist in ${tableName} table`);
          const customAgGrid: ConditionQueryDto = {
            filterType: columns.get(key) === "timestamp" ? "date" : "text",
            type: columns.get(key) === "string" ? "contains" : "equals",
            dateTo: null,
            filter: query.filters[key][0],
            dateFrom: query.filters[key][0],
          };
          composeQuery(builder, index, `${tableName}.${key}`, customAgGrid);
        });
      }

      if (query.sortBy)
        builder.orderBy(`${tableName}.${query.sortBy}`, query.sortOrder ?? "ASC");

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