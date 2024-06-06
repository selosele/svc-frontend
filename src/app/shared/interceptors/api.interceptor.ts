import { HttpInterceptorFn } from '@angular/common/http';

/** API 인터셉터 */
export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const baseUri = 'api';
  const newReq = req.clone({
    url: `${baseUri}${req.url}`,
    setHeaders: {
      'Content-Type': 'application/json'
    }
  });
  return next(newReq);
}
