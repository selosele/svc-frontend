import { Component } from '@angular/core';
import { AuthService } from '@app/auth/auth.service';
import { UiConfirmService } from '@app/shared/services';
import { LayoutPageTitleComponent } from '../layout-page-title/layout-page-title.component';
import { LayoutMenuComponent } from '../layout-menu/layout-menu.component';
import { UiButtonComponent } from '../../ui';

@Component({
  standalone: true,
  imports: [
    UiButtonComponent,
    LayoutPageTitleComponent,
    LayoutMenuComponent,
  ],
  selector: 'layout-header',
  templateUrl: './layout-header.component.html',
  styleUrl: './layout-header.component.scss'
})
export class LayoutHeaderComponent {

  constructor(
    private authService: AuthService,
    private confirmService: UiConfirmService,
  ) {}

  /** 로그아웃을 한다. */
  async logout(event: Event): Promise<void> {
    const confirm = await this.confirmService.confirm1(event, '로그아웃하시겠습니까?');
    if (!confirm) return;

    this.authService.logout();
  }

}
