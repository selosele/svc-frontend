import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { CodeService } from './code/code.service';
import { MenuService } from './shared/services';
import { LayoutHeaderComponent, LayoutMenuHistoryComponent, UiConfirmComponent, UiLoadingComponent, UiMessageComponent } from './shared/components';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    UiLoadingComponent,
    UiMessageComponent,
    UiConfirmComponent,
    LayoutHeaderComponent,
    LayoutMenuHistoryComponent,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService,
    private codeService: CodeService,
    private menuService: MenuService,
  ) {}

  /** 페이지 타이틀 */
  currentPageTitle$ = this.menuService.currentPageTitle$;

  /** 메뉴 목록 */
  menuList$ = this.menuService.menuList$;

  /** 로그인 여부 */
  get isLogined(): boolean {
    return this.authService.isLogined();
  }

  /** 현재 페이지가 메인 페이지인지 여부 */
  get isIndexPage(): boolean {
    return this.router.url === '/index';
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.authService.isLogined()) {
          if (this.codeService.codeListSubject.value.length === 0)
            this.codeService.listCode();
          
          if (this.authService.roleListSubject.value.length === 0)
            this.authService.listRole();
          
          this.menuService.setData();
        }
      });
  }
  
}
