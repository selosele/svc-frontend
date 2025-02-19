import { Component, ElementRef, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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

@Component({
  standalone: true,
  imports: [
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
  ) {
    super();
  }

  /** header 태그 */
  @ViewChild('header') header: ElementRef<HTMLElement>;

  /** 마지막 scroll top */
  lastScrollTop = 0;

  /** 스크롤 여부 */
  isScrollDown = true;

  /** 페이지 최상단에 스크롤되었는지 여부 */
  isScrollTop = false;

  /** 사용자 설정 */
  get userSetup() {
    return this.userStore.select<UserSetupResultDTO>('userSetup').value;
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

  /** 스크롤 시, header를 위로 이동한다. */
  @HostListener('document:scroll', ['$event'])
  onDocumentScroll(event: Event): void {
    if (window.scrollY < 0) return;

    if (Math.abs(window.scrollY - this.lastScrollTop) < this.header.nativeElement.offsetTop)
      return;

    this.isScrollTop = window.scrollY > 0;
    this.isScrollDown = window.scrollY < this.lastScrollTop;
    this.lastScrollTop = window.scrollY;
  }

}
