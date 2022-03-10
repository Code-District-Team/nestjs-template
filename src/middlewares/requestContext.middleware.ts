import { createNamespace, getNamespace } from "node-request-context";
import { RequestContext } from "../generalUtils/requestContext";

export function RequestContextMiddleware(req, res, next) {
  let rc = new RequestContext(req, res);

  const namespace = getNamespace("myapp.mynamespace") || createNamespace("myapp.mynamespace");

  namespace.run(() => {
    namespace.set("tid", rc);
    next();
  });
}
