import { HttpInterceptorFn } from '@angular/common/http';

export const interceptorServ: HttpInterceptorFn = (req, next) => {
 const token = localStorage.getItem('token') ;
  const request = req.clone();
  console.log('Interceptado')
  console.log(token)
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
