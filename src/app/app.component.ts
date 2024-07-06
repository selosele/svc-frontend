import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './auth/auth.service';
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
    protected authService: AuthService,
    private menuService: MenuService,
    private router: Router,
  ) {}

  /** 페이지 타이틀 */
  currentPageTitle$ = this.menuService.currentPageTitle$;

  /** 메뉴 목록 */
  menuList$ = this.menuService.menuList$;

  /** 현재 페이지가 메인 페이지인지 여부 */
  get isIndexPage(): boolean {
    return this.router.url === '/index';
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.authService.isLogined()) {
          this.menuService.setData();
        }
      });
  }
  
}
