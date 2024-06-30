import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, finalize, throwError } from 'rxjs';
import { UiLoadingService, UiMessageService } from '@app/shared/services';
import { isNotBlank } from '@app/shared/utils';
import { AuthService } from '@app/auth/auth.service';

/** API 인터셉터 */
export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const baseUri = 'api';
  const authService = inject(AuthService);
  const accessToken = authService.getAccessToken();
  const newReq = req.clone({
    url: `${baseUri}${req.url}`,
    setHeaders: {
      // Content-Type 헤더를 아래처럼 설정 시, API 서버에서 JSON이 아닌 형식의 데이터를 반환하면 오류 발생
      // 'Content-Type': 'application/json; charset=utf-8',
      ...(isNotBlank(accessToken) && { 'Authorization': `Bearer ${accessToken}` }),
    }
  });

  const loadingService = inject(UiLoadingService);
  const messsageService = inject(UiMessageService);

  loadingService.setLoading(true); // HTTP 요청이 진행 중일 때 로딩 레이어를 표출
  
  return next(newReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 400)
        messsageService.toastError(err.error.message);
      
      return throwError(() => err);
    }),
    finalize(() => {
      loadingService.setLoading(false); // HTTP 요청 종료 시 로딩 레이어 삭제
    })
  );
}
