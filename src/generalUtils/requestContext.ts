// import { AppUser } from "../../entities/appuser/appuser.entity";
import { getNamespace } from "node-request-context";

export class RequestContext {
  public readonly id: Number;
  public request: Request;
  public response: Response;

  constructor(request: Request, response: Response) {
    this.id = Math.random();
    this.request = request;
    this.response = response;
  }

  public static currentRequestContext(): RequestContext {
    let namespace = getNamespace("myapp.mynamespace");
    let rc = namespace.get("tid");
    return rc;
  }

  public static currentRequest(): Request {
    let requestContext = RequestContext.currentRequestContext();
    return requestContext.request;
  }

  public static currentUser(): any {
    let requestContext = RequestContext.currentRequestContext();
    return requestContext.request["user"];
  }
}
