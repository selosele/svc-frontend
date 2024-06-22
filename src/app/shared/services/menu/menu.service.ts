import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GetMenuRequestDTO, MenuResponseDTO } from '@app/shared/models';

@Injectable({ providedIn: 'root' })
export class MenuService {

  constructor(
    private http: HttpClient,
  ) {}

  private menuListSubject = new BehaviorSubject<MenuResponseDTO[]>([]);
  menuList$ = this.menuListSubject.asObservable();

  /** 메뉴 목록을 조회한다. */
  listMenu(getMenuRequestDTO?: GetMenuRequestDTO): void {
    this.http.get<MenuResponseDTO[]>('/menus', { params: { ...getMenuRequestDTO } })
    .subscribe((data) => {
      this.setMenuList(data);
    });
  }

  /** 메뉴 목록 데이터를 설정한다. */
  setMenuList(menuList: MenuResponseDTO[]): void {
    this.menuListSubject.next(menuList);
  }

}
