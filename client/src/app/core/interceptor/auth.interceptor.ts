import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from "@angular/core";
import {TokenService} from "../service/auth/token.service";
import {catchError, switchMap, throwError} from "rxjs";
import {Router} from "@angular/router";
import {StorageService} from "../service/auth/storage.service";
import {AuthService} from "../service/auth/auth.service";

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  let isRefreshing = false;

  const router = inject(Router);
  const storageService = inject((StorageService));
  const authService = inject(AuthService);
  req = req.clone({withCredentials:true});

  return next(req).pipe(
    catchError<any,any>(error => {
      if(error.status === 403 && !req.url.includes('auth/authenticate') && error instanceof HttpErrorResponse){
        if(!isRefreshing){
          isRefreshing = true;

          return authService.refreshToken().pipe(
            switchMap(() =>{
              isRefreshing = false;
              return next(req);
            }),

            catchError(error => {
              isRefreshing = false;

              if(error.status == '403'){
                storageService.logout();
                router.navigate(['/login']).then();
              }

              return throwError(() => error);
            })
          );
        }
      }
      return throwError(() => error);
    })
  );
};
