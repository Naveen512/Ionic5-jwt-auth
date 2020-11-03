import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from "@angular/common/http";
import { Observable, from, combineLatest } from "rxjs";
import { AuthService } from "../services/auth.service";
import { map, switchMap, catchError, flatMap } from "rxjs/operators";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Storage } from "@ionic/storage";

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  jwtHelper = new JwtHelperService();
  constructor(
    private authService: AuthService,
    private readonly storage: Storage
  ) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return combineLatest(
      this.authService.getAccessToken(),
      this.authService.getRefreshToke(),
      (access_token, refresh_toke) => {
        return {
          access_token,
          refresh_toke,
        };
      }
    ).pipe(
      switchMap((value) => {
        const transformedReq = req.clone({
          headers: req.headers.set(
            "Authorization",
            `bearer ${value.access_token}`
          ),
        });
        return next.handle(transformedReq).pipe(
          catchError((error) => {
            if (error.status === 401) {
              return this.authService.callRefreshToken(value).pipe(
                switchMap((newtoken: any) => {
                  this.storage.set("access_token", newtoken.access_token);
                  this.storage.set("refresh_token", newtoken.refresh_toke);
                  var decodedUser = this.jwtHelper.decodeToken(
                    newtoken.access_token
                  );
                  this.authService.userInfo.next(decodedUser);
                  const transformedReq = req.clone({
                    headers: req.headers.set(
                      "Authorization",
                      `bearer ${newtoken.access_token}`
                    ),
                  });
                  return next.handle(transformedReq);
                })
              );
            }
          })
        );
      })
    );
  }
}
