import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { CodeService } from '@app/code/code.service';
import { CodeResolverModel } from '@app/code/code.model';
import { map, of } from 'rxjs';

/** 코드 리졸버 */
export const codeResolver: ResolveFn<CodeResolverModel[]> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const codeService = inject(CodeService);
  const codeKeys = route.data['codeKeys'] || [];

  // 코드 목록이 비어 있을 경우에만 http 요청을 통해 목록을 가져온다.
  if (codeService.codeList.value.length === 0) {
    return codeService.listCode().pipe(
      map(() => {
        return codeKeys.reduce((acc, key) => {
          acc[key] = codeService.createCodeData(key);
          return acc;
        }, {});
      })
    );
  }

  // 이미 코드가 있는 경우 즉시 반환한다.
  return of(codeKeys.reduce((acc, key) => {
    acc[key] = codeService.createCodeData(key);
    return acc;
  }, {}));
};
