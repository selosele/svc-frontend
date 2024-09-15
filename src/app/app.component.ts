import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { StoreService } from './shared/services';
import { AuthService } from './auth/auth.service';
import { CodeService } from './code/code.service';
import { MenuService } from './menu/menu.service';
import { LayoutHeaderComponent, LayoutMenuHistoryComponent } from './shared/components/layout';
import { UiAlertComponent, UiConfirmComponent, UiLoadingComponent, UiMessageComponent } from './shared/components/ui';
import { MenuResponseDTO } from './menu/menu.model';

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
    private codeService: CodeService,
    private menuService: MenuService,
  ) {}

  /** 페이지 타이틀 */
  currentPageTitle$ = this.store.select<string>('currentPageTitle').asObservable();

  /** 메뉴 목록 */
  menuList$ = this.store.select<MenuResponseDTO[]>('menuList').asObservable();

  /** 로그인 여부 */
  get isLogined() {
    return this.authService.isLogined();
  }

  /** 현재 페이지가 메인 페이지인지 여부 */
  get isIndexPage() {
    return this.router.url === '/index';
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.authService.isLogined()) {
          if (!this.store.select<boolean>('codeListDataLoad').value) {
            this.codeService.listCode$().subscribe();
          }
          
          if (!this.store.select<boolean>('roleListDataLoad').value) {
            this.authService.listRole();
          }
          
          if (!this.store.select<boolean>('menuListDataLoad').value) {
            this.menuService.listMenu();
          }
        }
      });
  }
  
}
