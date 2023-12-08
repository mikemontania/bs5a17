import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';

export const interceptorServ: HttpInterceptorFn = (req, next) => {
  const service = inject(AuthService);
  const request = req.clone();
  console.log('1')
  if (service?.token()) {
    console.log(service?.token())
    console.log('2')
    req = request.clone({
      setHeaders: {
        Authorization: `Bearer ${service.token()}`
      }
    });

  }
  return next(req);
};
