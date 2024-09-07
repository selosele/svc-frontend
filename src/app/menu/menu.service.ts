import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { HttpService } from '@app/shared/services';
import { GetMenuRequestDTO, MenuResponseDTO, MenuTree } from '@app/menu/menu.model';

@Injectable({ providedIn: 'root' })
export class MenuService {

  constructor(
    private http: HttpClient,
    private httpService: HttpService,
    private route: ActivatedRoute,
  ) {}

  /** 메뉴접속이력 목록 저장 key */
  readonly MENU_HISTORY_LIST_KEY = 'menuHistoryList';

  /** 메뉴 목록 */
  private menuList = new BehaviorSubject<MenuResponseDTO[]>([]);
  menuList$ = this.menuList.asObservable();

  /** 메뉴 트리 목록 */
  private menuTree = new BehaviorSubject<MenuTree[]>([]);
  menuTree$ = this.menuTree.asObservable();

  /** 현재 메뉴 ID */
  private currentMenuId = new BehaviorSubject<number>(null);
  currentMenuId$ = this.currentMenuId.asObservable();

  /** 현재 상위 메뉴 ID */
  private currentUpMenuId = new BehaviorSubject<number>(null);
  currentUpMenuId$ = this.currentUpMenuId.asObservable();

  /** 현재 페이지 타이틀 */
  private currentPageTitle = new BehaviorSubject<string>(null);
  currentPageTitle$ = this.currentPageTitle.asObservable();

  /** 메뉴접속이력 목록 */
  menuHistoryList = new BehaviorSubject<MenuResponseDTO[]>([]);
  menuHistoryList$ = this.menuHistoryList.asObservable();

  /** 메뉴 목록을 조회한다. */
  listMenu(dto?: GetMenuRequestDTO): void {
    const params = this.httpService.createParams(dto);

    this.http.get<MenuResponseDTO[]>('/common/menus', { params })
    .subscribe((data) => {
      this.setMenuList(data);
    });
  }

  /** 권한별 메뉴 목록을 조회한다. */
  listMenuByRole$(dto?: GetMenuRequestDTO): Observable<MenuResponseDTO[]> {
    const params = this.httpService.createParams(dto);
    return this.http.get<MenuResponseDTO[]>('/common/menus', { params });
  }

  /** 메뉴 관련 데이터를 설정한다. */
  setData(): void {
    combineLatest([this.route.queryParams, this.menuList$]).subscribe(([queryParams, menuList]) => {
      if (menuList.length === 0) {
        this.listMenu();
      }

      if (menuList.length > 0) {
        const menuId = Number(queryParams?.menuId);
  
        this.setCurrentMenuId(menuId);
        this.setCurrentUpMenuId(menuList.find(x => x.menuId === menuId)?.upMenuId);
        this.setCurrentPageTitle(menuList.find(x => x.menuId === menuId)?.menuName);
      }
    });
  }

  /** 메뉴 목록 데이터를 설정한다. */
  setMenuList(menuList: MenuResponseDTO[]): void {
    const menuTree = this.createMenuTree(menuList);
    this.menuTree.next(menuTree);
    this.menuList.next(menuList);
  }

  /** 현재 메뉴 ID 데이터를 설정한다. */
  setCurrentMenuId(currentMenuId: number): void {
    this.currentMenuId.next(currentMenuId);
  }

  /** 현재 상위 메뉴 ID 데이터를 설정한다. */
  setCurrentUpMenuId(currentUpMenuId: number): void {
    this.currentUpMenuId.next(currentUpMenuId);
  }

  /** 현재 페이지 타이틀 데이터를 설정한다. */
  setCurrentPageTitle(currentPageTitle: string): void {
    this.currentPageTitle.next(currentPageTitle);
  }

  /** 메뉴접속이력 목록 데이터를 설정한다. */
  setMenuHistoryList(list: MenuResponseDTO[]): void {
    this.currentMenuId$.subscribe((menuId) => {
      list.sort((a, b) => a.menuId === menuId ? -1 : 1); // 가장 먼저 방문한 페이지가 맨 앞에 오게 하기
      this.menuHistoryList.next(list);
      window.localStorage.setItem(this.MENU_HISTORY_LIST_KEY, JSON.stringify(list));
    });
  }

  /** 메뉴 트리를 생성한다. */
  createMenuTree(data: MenuResponseDTO[], upMenuId = null): MenuTree[] {
    const tree: MenuTree[] = [];

    for (const menu of data) {
      if (menu.upMenuId === upMenuId) {
        const children = this.createMenuTree(data, menu.menuId);
        tree.push({ data: menu, children, expanded: false });
      }
    }
    return tree;
  }

}
