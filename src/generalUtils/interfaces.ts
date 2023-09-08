import { EntityTarget } from "typeorm/common/EntityTarget";
import { BaseEntity, ObjectLiteral } from "typeorm";

export interface RepoSelect {
  table: EntityTarget<BaseEntity>,
  select?: string[],
}

export interface RelationFilter {
  joinType: "inner" | "left",
  property: string,
  alias: string,
  condition?: string,
  parameters?: ObjectLiteral,
  select: string[],
}