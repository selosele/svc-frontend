import { Component, ElementRef, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthenticatedUser } from '@app/auth/auth.model';
import { AuthService } from '@app/auth/auth.service';
import { UiMessageService } from '@app/shared/services';
import { LayoutSiteTitleComponent } from '../layout-site-title/layout-site-title.component';
import { LayoutMenuComponent } from '../layout-menu/layout-menu.component';
import { UiButtonComponent } from '../../ui';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    UiButtonComponent,
    LayoutSiteTitleComponent,
    LayoutMenuComponent,
  ],
  selector: 'layout-header',
  templateUrl: './layout-header.component.html',
  styleUrl: './layout-header.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LayoutHeaderComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private messageService: UiMessageService,
  ) {}

  /** header 태그 */
  @ViewChild('header') header: ElementRef<HTMLElement>;

  /** 인증된 사용자 정보 */
  user: AuthenticatedUser;

  /** 마지막 scroll top */
  lastScrollTop = 0;

  /** 스크롤다운 여부 */
  isScrollDown = true;

  ngOnInit(): void {
    this.user = this.authService.getAuthenticatedUser();
    this.lastScrollTop = window.scrollY;
  }

  /** 로그아웃을 한다. */
  async logout(event: Event): Promise<void> {
    const confirm = await this.messageService.confirm1(event, '로그아웃하시겠습니까?');
    if (!confirm) return;

    this.authService.logout();
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
