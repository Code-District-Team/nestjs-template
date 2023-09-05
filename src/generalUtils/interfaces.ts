import { EntityTarget } from "typeorm/common/EntityTarget";
import { BaseEntity } from "typeorm";

export interface RepoSelect {
  table: EntityTarget<BaseEntity>,
  select?: string[],
}

export interface RelationFilter {
  table: EntityTarget<BaseEntity>,
  joinType: "inner" | "left",
  on: string,
  select: string[],
}