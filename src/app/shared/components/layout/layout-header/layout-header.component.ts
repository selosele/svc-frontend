import { Component, ElementRef, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthenticatedUser } from '@app/auth/auth.model';
import { UserSetupResponseDTO } from '@app/user/user.model';
import { AuthService } from '@app/auth/auth.service';
import { MenuService } from '@app/menu/menu.service';
import { StoreService, UiDialogService } from '@app/shared/services';
import { LayoutSiteTitleComponent } from '../layout-site-title/layout-site-title.component';
import { LayoutMenuComponent } from '../layout-menu/layout-menu.component';
import { LayoutNotificationComponent } from '../layout-notification/layout-notification.component';
import { UiButtonComponent } from '../../ui';
import { HumanMyInfoComponent } from '@app/human/human-my-info/human-my-info.component';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    UiButtonComponent,
    LayoutSiteTitleComponent,
    LayoutMenuComponent,
    LayoutNotificationComponent,
  ],
  selector: 'layout-header',
  templateUrl: './layout-header.component.html',
  styleUrl: './layout-header.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LayoutHeaderComponent implements OnInit {

  constructor(
    private store: StoreService,
    private authService: AuthService,
    private dialogService: UiDialogService,
    protected menuService: MenuService,
  ) {}

  /** header 태그 */
  @ViewChild('header') header: ElementRef<HTMLElement>;

  /** 인증된 사용자 정보 */
  user: AuthenticatedUser;

  /** 마지막 scroll top */
  lastScrollTop = 0;

  /** 스크롤다운 여부 */
  isScrollDown = true;

  /** 사용자 설정 */
  get userSetup() {
    return this.store.select<UserSetupResponseDTO>('userSetup').value;
  }

  ngOnInit() {
    this.user = this.authService.getAuthenticatedUser();
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

  /** 스크롤다운 시, header를 위로 이동한다. */
  @HostListener('document:scroll', ['$event'])
  onScroll(event: Event): void {
    if (window.scrollY < 0)
      return;

    if (Math.abs(window.scrollY - this.lastScrollTop) < this.header.nativeElement.offsetTop)
      return;

    this.isScrollDown = window.scrollY < this.lastScrollTop;
    this.lastScrollTop = window.scrollY;
  }

}
