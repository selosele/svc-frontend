import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { GetMenuRequestDTO, MenuResponseDTO, MenuTree } from '@app/menu/menu.model';

@Injectable({ providedIn: 'root' })
export class MenuService {

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
  ) {}

  /** 메뉴접속이력 목록 저장 키 */
  readonly MENU_HISTORY_LIST_KEY = 'menuHistoryList';

  menuHistoryListSubject = new BehaviorSubject<MenuResponseDTO[]>([]);

  private menuListSubject = new BehaviorSubject<MenuResponseDTO[]>([]);
  private menuTreeSubject = new BehaviorSubject<MenuTree[]>([]);
  private currentMenuIdSubject = new BehaviorSubject<number>(null);
  private currentUpMenuIdSubject = new BehaviorSubject<number>(null);
  private currentPageTitleSubject = new BehaviorSubject<string>(null);

  /** 메뉴 목록 */
  menuList$ = this.menuListSubject.asObservable();

  /** 메뉴 트리 목록 */
  menuTree$ = this.menuTreeSubject.asObservable();

  /** 현재 메뉴 ID */
  currentMenuId$ = this.currentMenuIdSubject.asObservable();

  /** 현재 상위 메뉴 ID */
  currentUpMenuId$ = this.currentUpMenuIdSubject.asObservable();

  /** 현재 페이지 타이틀 */
  currentPageTitle$ = this.currentPageTitleSubject.asObservable();

  /** 메뉴접속이력 목록 */
  menuHistoryList$ = this.menuHistoryListSubject.asObservable();

  /** 메뉴 목록을 조회한다. */
  listMenu(getMenuRequestDTO?: GetMenuRequestDTO): void {
    this.http.get<MenuResponseDTO[]>('/common/menus', { params: { ...getMenuRequestDTO } })
    .subscribe((data) => {
      this.setMenuList(data);
    });
  }

  /** 메뉴 관련 데이터를 설정한다. */
  setData(): void {
    combineLatest([this.route.queryParams, this.menuList$]).subscribe(([params, menuList]) => {
      if (menuList.length === 0) {
        this.listMenu();
      }

      if (menuList.length > 0) {
        const menuId = Number(params?.menuId);
  
        this.setCurrentMenuId(menuId);
        this.setCurrentUpMenuId(menuList.find(x => x.menuId === menuId)?.upMenuId);
        this.setCurrentPageTitle(menuList.find(x => x.menuId === menuId)?.menuName);
      }
    });
  }

  /** 메뉴 목록 데이터를 설정한다. */
  setMenuList(menuList: MenuResponseDTO[]): void {
    const menuTree = this.createMenuTree(menuList);
    this.menuTreeSubject.next(menuTree);
    this.menuListSubject.next(menuList);
  }

  /** 현재 메뉴 ID 데이터를 설정한다. */
  setCurrentMenuId(currentMenuId: number): void {
    this.currentMenuIdSubject.next(currentMenuId);
  }

  /** 현재 상위 메뉴 ID 데이터를 설정한다. */
  setCurrentUpMenuId(currentUpMenuId: number): void {
    this.currentUpMenuIdSubject.next(currentUpMenuId);
  }

  /** 현재 페이지 타이틀 데이터를 설정한다. */
  setCurrentPageTitle(currentPageTitle: string): void {
    this.currentPageTitleSubject.next(currentPageTitle);
  }

  /** 메뉴접속이력 목록 데이터를 설정한다. */
  setMenuHistoryList(list: MenuResponseDTO[]): void {
    this.currentMenuId$.subscribe((menuId) => {
      list.sort((a, b) => a.menuId === menuId ? -1 : 1); // 가장 먼저 방문한 페이지가 맨 앞에 오게 하기
      this.menuHistoryListSubject.next(list);
      window.localStorage.setItem(this.MENU_HISTORY_LIST_KEY, JSON.stringify(list));
    });
  }

  /** 메뉴 트리를 생성한다. */
  createMenuTree(data: MenuResponseDTO[], upMenuId = null): MenuTree[] {
    const tree: MenuTree[] = [];

    for (const menu of data) {
      if (menu.upMenuId === upMenuId) {
        const children = this.createMenuTree(data, menu.menuId);
        tree.push({ ...menu, children });
      }
    }
    return tree;
  }

}
