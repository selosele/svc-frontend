import { Injectable } from '@angular/core';
import { MenuService } from '../menu/menu.service';
import { HumanService } from '@app/human/human.service';
import { CodeService } from '@app/code/code.service';

@Injectable({ providedIn: 'root' })
export class StateService {

  constructor(
    private menuService: MenuService,
    private codeService: CodeService,
    private humanService: HumanService,
  ) {}

  /** 모든 상태를 초기화한다. */
  clearAllState(): void {
    // TODO: 로그아웃 시 상태 초기화 필수
    this.menuService.setMenuList([]);

    this.codeService.codeListSubject.next([]);
    this.codeService.codeListDataLoadSubject.next(false);
    this.codeService.codeTreeSubject.next([]);
    
    this.humanService.employeeSubject.next(null);
    this.humanService.employeeDataLoadSubject.next(false);
    
  }

}
