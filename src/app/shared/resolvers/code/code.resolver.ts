import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { map, of } from 'rxjs';
import { CodeService } from '@app/code/code.service';
import { CodeResolverModel } from '@app/code/code.model';

/** 코드 리졸버 */
export const codeResolver: ResolveFn<CodeResolverModel[]> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const codeService = inject(CodeService);
  const codeKeys = route.data['codeKeys'] || [];

  // 코드 목록을 불러오지 않았을 때만 HTTP 요청을 통해 목록을 가져온다.
  if (!codeService.codeListDataLoad.value) {
    return codeService.listCode().pipe(
      map(() => {
        return codeKeys.reduce((acc, upCodeId) => {
          acc[upCodeId] = codeService.createCodeData(upCodeId);
          return acc;
        }, {});
      })
    );
  }

  // 이미 코드가 있는 경우 즉시 반환한다.
  return of(codeKeys.reduce((acc, upCodeId) => {
    acc[upCodeId] = codeService.createCodeData(upCodeId);
    return acc;
  }, {}));
};
