import {
  HttpClient,
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { ERROR_CODE } from '../constants';
import { enviroment } from '../enviroment/enviroment';
import { GetNewAccessTokenResponse } from '../response/user';
import { TokenService } from '../services/token/token.service';
import { isTokenExpired, isUseToken } from '../utils';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private tokenService: TokenService, private http: HttpClient) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    const accessToken = this.tokenService.getToken();
    const refreshToken = this.tokenService.getRefreshToken();
    if (accessToken && refreshToken && isUseToken(request.url)) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (
          err.error?.errorCode === ERROR_CODE.TOKEN_EXPIRED &&
          accessToken &&
          refreshToken
        ) {
          if (isTokenExpired(accessToken)) {
            if (isTokenExpired(refreshToken)) {
              this.tokenService.removeToken();
              this.tokenService.removeRefreshToken();
              window.location.reload();
            }
            return this.http
              .post<GetNewAccessTokenResponse>(
                `${enviroment.baseUrl}/auth/refresh-token`,
                {
                  token: refreshToken,
                }
              )
              .pipe(
                switchMap((res: GetNewAccessTokenResponse) => {
                  this.tokenService.setToken(res.access_token);
                  this.tokenService.setRefreshToken(res.refresh_token);
                  return next.handle(
                    request.clone({
                      setHeaders: {
                        Authorization: `Bearer ${res.access_token}`,
                      },
                    })
                  );
                })
              );
          }
        }
        return throwError(() => err);
      })
    );
  }
}
