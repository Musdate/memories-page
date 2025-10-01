import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "@auth/services/auth.service";

export function authInterceptor(
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
) {

  const authToken = inject( AuthService );
  const token = authToken.token();

  const headers = token ? req.headers.append('Authorization', `Bearer ${token}`) : req.headers;

  const newReq = req.clone({ headers });

  return next(newReq);

}