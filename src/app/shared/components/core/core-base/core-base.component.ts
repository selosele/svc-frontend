import { Component, inject } from '@angular/core';
import { AuthService } from '@app/auth/auth.service';
import { MenuService } from '@app/menu/menu.service';
import { dateUtil, numberWithCommas as _numberWithCommas, roles } from '@app/shared/utils';

/**
 * 모든 컴포넌트의 기본이 되는 컴포넌트.
 * 해당 컴포넌트를 반드시 상속받을 필요는 없지만
 * 공통 로직을 재사용하고 싶을 경우 상속받아서 사용한다.
 */
@Component({
  standalone: true,
  imports: [],
  selector: 'core-base',
  templateUrl: './core-base.component.html',
  styleUrl: './core-base.component.scss'
})
export class CoreBaseComponent {

  /** 인증·인가 서비스 */
  protected authService = inject(AuthService);
  
  /** 메뉴 서비스 */
  protected menuService = inject(MenuService);

  /** 인증된 사용자 정보 */
  protected get user() {
    return this.authService.getAuthenticatedUser();
  }

  /** 로그인 여부 */
  protected get isLogined() {
    return this.authService.isLogined();
  }

  /** 시스템관리자 권한 여부 */
  protected get isSystemAdmin() {
    return this.authService.hasRole(roles.SYSTEM_ADMIN.id);
  }

  /** 액션 목록 */
  protected get actions() {
    return {

      /** 추가/수정/삭제 */
      SAVE: 'SAVE',
    
      /** 수정 */
      UPDATE: 'UPDATE',
    
      /** 복사 */
      COPY: 'COPY',
    
      /** 새로고침 */
      RELOAD: 'RELOAD',
    
    };
  }

  /** 메뉴 URL로 메뉴 ID를 찾아서 반환한다. */
  protected getMenuIdByMenuUrl(menuUrl: string): number {
    return this.menuService.getMenuIdByMenuUrl(menuUrl);
  }

  /** Angular 템플릿에서 사용할 수 있도록 string -> Date로 변환 후 반환한다. */
  protected ngDate(date: string, format = 'YYYY-MM-DD'): Date {
    return new Date(dateUtil(date).format(format));
  }

  /** 숫자를 천 단위 콤마기호와 함께 문자열로 반환한다. */
  protected numberWithCommas(value: number | string): string {
    return _numberWithCommas(value);
  }

}
