import { Injectable, Scope } from "@nestjs/common";
import { BaseEntity, SaveOptions } from "typeorm";
import { RequestContext } from "./requestContext";

@Injectable({ scope: Scope.REQUEST })
export class ExtendedEntity extends BaseEntity {
  constructor() {
    super();
  }

  async save(options?: SaveOptions): Promise<this> {
    this["organizationId"] = RequestContext.currentRequest().body["organizationId"];
    return await super.save.bind(this)(options);
  }
}
