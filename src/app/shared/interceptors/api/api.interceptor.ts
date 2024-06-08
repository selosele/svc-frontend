import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UiMessageService } from '@app/shared/services/ui/ui-message-service';
import { isNotBlank } from '@app/shared/utils';
import { catchError, throwError } from 'rxjs';

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

  const messsage: UiMessageService = inject(UiMessageService);
  
  return next(newReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 400) {
        messsage.error(err.error.message);
      }
      return throwError(() => err);
    })
  );
}
