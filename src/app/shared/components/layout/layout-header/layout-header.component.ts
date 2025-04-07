import { Component, ElementRef, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CoreBaseComponent } from '../../core';
import { UserSetupResultDTO } from '@app/user/user.model';
import { UserStore } from '@app/user/user.store';
import { UiDialogService } from '@app/shared/services';
import { LayoutSiteTitleComponent } from '../layout-site-title/layout-site-title.component';
import { LayoutMenuComponent } from '../layout-menu/layout-menu.component';
import { LayoutNotificationComponent } from '../layout-notification/layout-notification.component';
import { UiButtonComponent, UiSkeletonComponent } from '../../ui';
import { HumanMyInfoComponent } from '@app/human/human-my-info/human-my-info.component';
import { LayoutMobileMenuStore } from '../layout-mobile-menu/layout-mobile-menu.store';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    UiButtonComponent,
    UiSkeletonComponent,
    LayoutSiteTitleComponent,
    LayoutMenuComponent,
    LayoutNotificationComponent,
  ],
  selector: 'layout-header',
  templateUrl: './layout-header.component.html',
  styleUrl: './layout-header.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LayoutHeaderComponent extends CoreBaseComponent implements OnInit {

  constructor(
    private userStore: UserStore,
    private dialogService: UiDialogService,
    private layoutMobileMenuStore: LayoutMobileMenuStore,
  ) {
    super();
  }

  /** header 태그 */
  @ViewChild('header') header: ElementRef<HTMLElement>;

  /** 마지막 scroll top */
  lastScrollTop = 0;

  /** 스크롤 여부 */
  isScrollDown = true;

  /** 스크롤 활성화 여부 */
  isScrollActive = false;

  /** 사용자 설정 */
  get userSetup() {
    return this.userStore.select<UserSetupResultDTO>('userSetup').value;
  }

  /** 모바일 메뉴 표출 여부 */
  get isMobileMenuVisible() {
    return this.layoutMobileMenuStore.select<boolean>('isVisible').value;
  }

  ngOnInit() {
    this.lastScrollTop = window.scrollY;
  }

  /** 로그아웃을 한다. */
  logout(): void {
    this.authService.logout();
  }

  /** 내정보 modal을 표출한다. */
  showMyPageModal(event: Event): void {
    this.dialogService.open(HumanMyInfoComponent, {
      focusOnShow: false,
      header: '내 정보 조회',
    });
  }

  /** 모바일 메뉴를 토글한다. */
  toggleMobileMenu(): void {
    this.layoutMobileMenuStore.update('isVisible', !this.isMobileMenuVisible);
  }

  /** 스크롤시, header를 위로 이동한다. */
  // @HostListener('document:scroll', ['$event'])
  // onDocumentScroll(event: Event): void {
  //   if (window.scrollY < 0) return;

  //   if (Math.abs(window.scrollY - this.lastScrollTop) < this.header.nativeElement.offsetTop)
  //     return;

  //   this.isScrollActive = window.scrollY > 0;
  //   this.isScrollDown = window.scrollY < this.lastScrollTop;
  //   this.lastScrollTop = window.scrollY;
  // }

}
