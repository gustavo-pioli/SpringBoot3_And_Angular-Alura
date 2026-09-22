import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Autenticacao } from '../services/Autenticacao';
import { catchError, Subject, switchMap, take, throwError } from 'rxjs';

let refreshEmProgresso = false;
const refreshConcluido$ = new Subject<string>();


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Autenticacao);
  const token = localStorage.getItem("token");
  const reqComToken = token ? req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) }) : req;

  return next(reqComToken).pipe(
    catchError((erro: HttpErrorResponse) => {
      if(erro.status !== 401 || req.url.includes('/login')){
        return throwError(() => erro);
      }

      if(!refreshEmProgresso) {
        refreshEmProgresso = true;
        return auth.renovarToken().pipe(
          switchMap((novoToken) => {
            refreshEmProgresso = false;
            refreshConcluido$.next(novoToken);
            return next(req.clone({ headers: req.headers.set('Authorization', `Bearer ${novoToken}`)}))
          }),
          catchError((errorRefresh) => {
            refreshEmProgresso = false;
            auth.logout();
            return throwError(() => errorRefresh);
          })
        )
      }

      return refreshConcluido$.pipe(
        take(1),
        switchMap((novoToken) => next(req.clone({ headers: req.headers.set('Authorization', `Bearer ${novoToken}`)}))),
      )
    })
  );
};
