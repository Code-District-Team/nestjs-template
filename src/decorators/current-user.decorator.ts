import { createParamDecorator, ExecutionContext } from '@nestjs/common';


/**
 * A custom parameter decorator to extract the current user from the request. 
 * It retrieves the user object from the request body and, if a specific data field is requested, 
 * returns that particular value from the user object. 
 * If no user is found in the request, or the specified data field does not exist, it returns null.
 */

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const user = ctx.switchToHttp().getRequest().body.user;
    if (!user) {
      return null;
    }
    return data ? user[data] : user;
  },
);
