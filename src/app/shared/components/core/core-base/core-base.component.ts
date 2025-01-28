import { Component, inject } from '@angular/core';
import { AuthService } from '@app/auth/auth.service';
import { roles } from '@app/shared/utils';

/**
 * 모든 컴포넌트의 기본이 되는 컴포넌트.
 * 해당 컴포넌트를 반드시 상속받을 필요는 없지만
 * 인증·인가 로직 등을 재사용하고 싶을 경우 상속받아서 사용한다.
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

}
