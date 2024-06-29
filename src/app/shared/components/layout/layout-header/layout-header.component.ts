import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserResponseDTO } from '@app/auth/auth.dto';
import { AuthService } from '@app/auth/auth.service';
import { UiMessageService } from '@app/shared/services';
import { LayoutSiteTitleComponent } from '../layout-site-title/layout-site-title.component';
import { LayoutMenuComponent } from '../layout-menu/layout-menu.component';
import { UiButtonComponent, UiRouterLinkComponent } from '../../ui';

@Component({
  standalone: true,
  imports: [
    UiButtonComponent,
    UiRouterLinkComponent,
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

  /** 인증된 사용자 정보 */
  user: UserResponseDTO;

  ngOnInit(): void {
    this.user = this.authService.getAuthenticatedUser();
  }

  /** 로그아웃을 한다. */
  async logout(event: Event): Promise<void> {
    const confirm = await this.messageService.confirm1(event, '로그아웃하시겠습니까?');
    if (!confirm) return;

    this.authService.logout();
  }

}
