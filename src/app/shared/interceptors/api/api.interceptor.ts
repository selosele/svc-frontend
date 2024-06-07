import { HttpInterceptorFn } from '@angular/common/http';
import { isNotBlank } from '@app/shared/utils';

/** API 인터셉터 */
export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const baseUri = 'api';
  const accessToken = window.localStorage.getItem('accessToken');
  const newReq = req.clone({
    url: `${baseUri}${req.url}`,
    setHeaders: {
      'Content-Type': 'application/json',
      ...(isNotBlank(accessToken) && { 'Authorization': `Bearer ${accessToken}` }),
    }
  });
  return next(newReq);
}
