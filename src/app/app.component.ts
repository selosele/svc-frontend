import { AfterViewChecked, Component, ElementRef, HostListener, NgZone, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { CoreBaseComponent } from './shared/components/core';
import { StoreService, UiMessageService } from './shared/services';
import { UserService } from './user/user.service';
import { RoleService } from './role/role.service';
import { CodeService } from './code/code.service';
import { MenuService } from './menu/menu.service';
import { MenuResponseDTO } from './menu/menu.model';
import { LayoutBreadcrumbComponent, LayoutHeaderComponent, LayoutMenuBookmarkComponent } from './shared/components/layout';
import { UiAlertComponent, UiButtonComponent, UiConfirmComponent, UiLoadingComponent, UiMessageComponent } from './shared/components/ui';
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
    UiButtonComponent,
    LayoutHeaderComponent,
    LayoutMenuBookmarkComponent,
    LayoutBreadcrumbComponent,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent extends CoreBaseComponent implements OnInit, AfterViewChecked {

  constructor(
    private zone: NgZone,
    private router: Router,
    private store: StoreService,
    private messageService: UiMessageService,
    private userService: UserService,
    private roleService: RoleService,
    private codeService: CodeService,
    private menuService: MenuService,
  ) {
    super();
  }

  /** 레이아웃 하단 박스 요소 */
  @ViewChild('layoutBottom') lmh: ElementRef<HTMLElement>;

  /** 마지막 scroll top */
  lastScrollTop = 0;

  /** 스크롤 중인지 여부 */
  isScroll = false;

  /** 페이지 타이틀 */
  currentPageTitle$ = this.menuService.getCurrentPageTitle$();
  
  /** 현재 메뉴 */
  currentMenu: MenuResponseDTO;

  /** 현재 메뉴 ID */
  get currentMenuId() {
    return this.store.select<number>('currentMenuId').value;
  }

  /** 현재 페이지가 메인 페이지인지 여부 */
  get isIndexPage() {
    return this.router.url === MAIN_PAGE_PATH2;
  }

  /** 현재 메뉴가 즐겨찾기 추가되어 있는지 여부 */
  get hasBookmark() {
    return this.store.select<boolean>('hasBookmark').value;
  }

  set hasBookmark(value: boolean) {
    this.store.update('hasBookmark', value);
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
            const { userId } = this.user;
            this.userService.getUserConfig(userId);
          }

          // 알림창 닫기
          this.store.update('isNotificationLayerVisible', false);

          // 즐겨찾기 등의 표시를 위해 현재 메뉴를 찾기
          this.currentMenu = this.store.select<MenuResponseDTO[]>('menuList').value
            ?.find(x => x.menuId === this.currentMenuId);
          this.hasBookmark = this.currentMenu?.menuBookmarkId !== null;
        }
      });
  }

  ngAfterViewChecked() {
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.detectScrollEnd();
      });
    });
  }

  /** 메뉴 즐겨찾기를 추가/수정한다. */
  saveMenuBookmark(menuBookmarkId: number): void {
    if (this.hasBookmark) {
      this.menuService.removeMenuBookmark$(menuBookmarkId)
      .subscribe(() => {
        this.messageService.toastSuccess('즐겨찾기 삭제되었어요.');
        this.hasBookmark = false;
        this.menuService.listMenuBookmark();
        this.menuService.listMenu$()
        .subscribe((data) => {
          this.menuService.setMenuList(data);
          this.currentMenu = this.store.select<MenuResponseDTO[]>('menuList').value
            ?.find(x => x.menuId === this.currentMenuId);
        });
      });
    }
    else {
      this.menuService.addMenuBookmark$({ menuId: this.currentMenuId, userId: Number(this.user?.userId) })
      .subscribe((data) => {
        this.messageService.toastSuccess('즐겨찾기 추가되었어요.');
        this.hasBookmark = true;
        this.menuService.listMenuBookmark();
        this.menuService.listMenu$()
        .subscribe((data) => {
          this.menuService.setMenuList(data);
          this.currentMenu = this.store.select<MenuResponseDTO[]>('menuList').value
            ?.find(x => x.menuId === this.currentMenuId);
        });
      });
    }
  }

  /** 페이지 맨 하단으로 스크롤했는지 감지한다. */
  detectScrollEnd(): void {
    if (this.lmh) {
      const lmhBottom = this.lmh.nativeElement.getBoundingClientRect().bottom;
      this.isScroll = lmhBottom >= window.innerHeight;
    } else {
      this.isScroll = false;
    }
  }

  /** 페이지 맨 하단으로 스크롤 시, scroll 클래스를 추가한다. */
  @HostListener('document:scroll', ['$event'])
  onDocumentScroll(event: Event): void {
    if (window.scrollY < 0) return;
    this.detectScrollEnd();
  }
  
}
