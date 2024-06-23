import { Injectable } from '@angular/core';
import { MenuService } from '../menu/menu.service';

@Injectable({ providedIn: 'root' })
export class StateService {

  constructor(
    private menuService: MenuService,
  ) {}

  /** 모든 상태를 초기화한다. */
  clearAllState(): void {
    // TODO: 로그아웃 시 상태 초기화 필수
    this.menuService.setMenuList([]);
  }

}
