import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import {mergeMap, Observable, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
import {AuthService} from "./services/auth-service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error) => {
        console.log(error)
        if (error instanceof HttpErrorResponse && error.status === 401 && error.error.detail === 'Token has Expired') {
          return this.handleTokenExpiration(request, next);
        }

        return throwError(error);
      })
    );
  }

  private handleTokenExpiration(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.refreshAccessToken().pipe(
      mergeMap(() => {
        window.location.reload();
        return next.handle(request);
      }),
      catchError((refreshError) => {
        return throwError(refreshError);
      })
    );
  }

}
