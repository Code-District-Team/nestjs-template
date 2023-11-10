import { SelectQueryBuilder } from "typeorm";
import { TableMetadataArgs } from "typeorm/metadata-args/TableMetadataArgs";

export type Scope<Entity> = (qb: SelectQueryBuilder<Entity>, alias: any) => SelectQueryBuilder<Entity>;

export interface ScopedTableMetadata<Entity> extends TableMetadataArgs {
    scopes: Scope<Entity>[];
    scopesEnabled: boolean;
}
