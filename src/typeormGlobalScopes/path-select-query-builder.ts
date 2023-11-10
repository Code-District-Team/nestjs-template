import { Body, Inject, Injectable, Req, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";

import { EntryType } from "perf_hooks";
import { ObjectLiteral, SelectQueryBuilder } from "typeorm";
import { ScopedTableMetadata } from "./ScopedTableMetadata";

const GET_QUERY_COPY = "___global_scopes_getQuery_copy___";

@Injectable({ scope: Scope.REQUEST })
class MySelectQB<Entity extends ObjectLiteral> extends SelectQueryBuilder<Entity> {
  constructor(
    selectQueryBuilder: SelectQueryBuilder<Entity>,
    @Inject(REQUEST) private request: any,
    @Req() req,
    @Body() body: EntryType
  ) {
    super(selectQueryBuilder);
  }

  /**
   * Gets generated sql query without parameters being replaced.
   */
  getQuery(): string {
    this.___patchScopes___();
    return this[GET_QUERY_COPY]();
  }

  /**
   * Executes Entity global scopes
   */
  protected ___patchScopes___(): void {
    const table = this.expressionMap.mainAlias;
    if (!table || !table.hasMetadata) return;
    const metadata = table.metadata.tableMetadataArgs as ScopedTableMetadata<Entity>;
    if (metadata.scopes && metadata.scopesEnabled) {
      metadata.scopes.forEach((scope) => scope(this, table));
    } else if (metadata.scopesEnabled === false) {
      metadata.scopesEnabled = true;
    }
  }
}

GET_QUERY_COPY;

/**
 * Patch SelectQueryBuilder with own implementation that executes the entity global query scopes
 */
export const patchSelectQueryBuilder = () => {
  // Saves original getQuery method so we don't lose it's original functionality
  SelectQueryBuilder.prototype[GET_QUERY_COPY] = SelectQueryBuilder.prototype.getQuery;
  Object.getOwnPropertyNames(MySelectQB.prototype).forEach((propertie) =>
    Object.defineProperty(
      SelectQueryBuilder.prototype,
      propertie,
      Object.getOwnPropertyDescriptor(MySelectQB.prototype, propertie) as PropertyDescriptor
    )
  );
};
