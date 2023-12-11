import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';

export const interceptorServ: HttpInterceptorFn = (req, next) => {
 const token = localStorage.getItem('token') ;
  const request = req.clone();
  console.log('Interceptado')
  if (token) {
    console.log(token)

    req = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

  }
  return next(req);
};
