import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { StoreService } from './shared/services';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import { RoleService } from './role/role.service';
import { CodeService } from './code/code.service';
import { MenuService } from './menu/menu.service';
import { LayoutBreadcrumbComponent, LayoutHeaderComponent, LayoutMenuHistoryComponent } from './shared/components/layout';
import { UiAlertComponent, UiConfirmComponent, UiLoadingComponent, UiMessageComponent } from './shared/components/ui';
import { MAIN_PAGE_PATH2 } from './shared/utils';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    UiLoadingComponent,
    UiMessageComponent,
    UiConfirmComponent,
    UiAlertComponent,
    LayoutHeaderComponent,
    LayoutMenuHistoryComponent,
    LayoutBreadcrumbComponent,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  constructor(
    private router: Router,
    private store: StoreService,
    private authService: AuthService,
    private userService: UserService,
    private roleService: RoleService,
    private codeService: CodeService,
    private menuService: MenuService,
  ) {}

  /** 페이지 타이틀 */
  currentPageTitle$ = this.menuService.getCurrentPageTitle$();

  /** 로그인 여부 */
  get isLogined() {
    return this.authService.isLogined();
  }

  /** 현재 페이지가 메인 페이지인지 여부 */
  get isIndexPage() {
    return this.router.url === MAIN_PAGE_PATH2;
  }

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.isLogined) {

          // 코드 목록 조회
          if (!this.store.select<boolean>('codeListDataLoad').value) {
            this.codeService.listCode$().subscribe();
          }
          
          // 권한 목록 조회
          if (!this.store.select<boolean>('roleListDataLoad').value) {
            this.roleService.listRole();
          }

          // 사용자 설정 조회
          if (!this.store.select<boolean>('userSetupDataLoad').value) {
            const { userId } = this.authService.getAuthenticatedUser();
            this.userService.getUserConfig(userId);
          }

          // 알림창 닫기
          this.store.update('isNotificationLayerVisible', false);
        }
      });
  }
  
}
