import { Component } from '@angular/core';
import { UiButtonComponent } from '../../ui';
import { AuthService } from '@app/auth/auth.service';
import { LayoutPageTitleComponent } from '../layout-page-title/layout-page-title.component';

@Component({
  standalone: true,
  imports: [
    UiButtonComponent,
    LayoutPageTitleComponent,
  ],
  selector: 'layout-header',
  templateUrl: './layout-header.component.html',
  styleUrl: './layout-header.component.scss'
})
export class LayoutHeaderComponent {

  constructor(
    private authService: AuthService,
  ) {}

  /** 로그아웃을 한다. */
  logout(): void {
    // TODO: confirm창 띄워서 로그아웃 예/아니오 선택
    this.authService.logout();
  }

}
