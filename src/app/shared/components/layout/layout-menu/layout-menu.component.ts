import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MenuService } from '@app/shared/services';
import { UiLinkComponent } from '../../ui';
import { AuthService } from '@app/auth/auth.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    UiLinkComponent,
  ],
  selector: 'layout-menu',
  templateUrl: './layout-menu.component.html',
  styleUrl: './layout-menu.component.scss'
})
export class LayoutMenuComponent implements OnInit {

  constructor(
    private menuService: MenuService,
    private authService: AuthService,
  ) {}

  /** 메뉴 목록 */
  menuList$ = this.menuService.menuList$;

  ngOnInit(): void {
    this.menuList$.subscribe((menuList) => {
      if (menuList.length === 0 && this.authService.isLogined()) {
        this.listMenu();
      }
    });
  }

  /** 메뉴 목록을 조회한다. */
  listMenu(): void {
    this.menuService.listMenu();
  }

}
