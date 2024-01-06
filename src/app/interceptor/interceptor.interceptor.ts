import { HttpInterceptorFn } from '@angular/common/http';

export const interceptorServ: HttpInterceptorFn = (req, next) => {
 const token = localStorage.getItem('token') ;
  const request = req.clone();
  if (token) {
    req = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

  }
  return next(req);
};
