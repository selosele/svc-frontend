import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MenuResponseDTO } from '../layout-menu/menu.dto';
import { UiButtonComponent } from '../../ui';
import { MenuService } from '@app/shared/services';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    UiButtonComponent,
  ],
  selector: 'layout-menu-history',
  templateUrl: './layout-menu-history.component.html',
  styleUrl: './layout-menu-history.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LayoutMenuHistoryComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private menuService: MenuService,
  ) {}

  /** 메뉴접속이력 목록 */
  menuHistoryList$ = this.menuService.menuHistoryList$;
  
  get menuHistoryList() {
    return this.menuService.menuHistoryListSubject.value;
  }

  /** 메뉴 ID */
  menuId: number;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.menuId = Number(params?.menuId);
      this.menuService.setMenuHistoryList(
        JSON.parse(window.localStorage.getItem(this.menuService.MENU_HISTORY_LIST_KEY)
      ) as MenuResponseDTO[]);
    });
  }

  /** 삭제 버튼을 클릭해서 메뉴접속이력을 삭제한다. */
  onRemove(menuId: number): void {
    this.menuService.setMenuHistoryList(this.menuHistoryList.filter(x => x.menuId !== menuId));
  }

}
