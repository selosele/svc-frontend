import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { HttpService, StoreService } from '@app/shared/services';
import { GetMenuRequestDTO, MenuResponseDTO, MenuTree } from '@app/menu/menu.model';

@Injectable({ providedIn: 'root' })
export class MenuService {

  constructor(
    private http: HttpClient,
    private httpService: HttpService,
    private route: ActivatedRoute,
    private store: StoreService,
  ) {}

  /** 메뉴접속이력 목록 저장 key */
  readonly MENU_HISTORY_LIST_KEY = 'menuHistoryList';

  /** 메뉴 목록 */
  private menuList = this.store.create<MenuResponseDTO[]>('menuList', []);

  /** 메뉴 목록 데이터 로드 완료 여부 */
  private menuListDataLoad = this.store.create<boolean>('menuListDataLoad', false);

  /** 메뉴 트리 목록 */
  private menuTree = this.store.create<MenuTree[]>('menuTree', []);

  /** 현재 메뉴 ID */
  private currentMenuId = this.store.create<number>('currentMenuId', null);

  /** 현재 상위 메뉴 ID */
  private currentUpMenuId = this.store.create<number>('currentUpMenuId', null);

  /** 현재 페이지 타이틀 */
  private currentPageTitle = this.store.create<string>('currentPageTitle', null);

  /** 메뉴접속이력 목록 */
  private menuHistoryList = this.store.create<MenuResponseDTO[]>('menuHistoryList', []);

  /** breadcrumb 목록 */
  private breadcrumbList = this.store.create<MenuItem[]>('breadcrumbList', []);

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
    combineLatest([
      this.route.queryParams,
      this.store.select<MenuResponseDTO[]>('menuList').asObservable()
    ])
    .subscribe(([queryParams, menuList]) => {
      if (menuList.length === 0) return;

      const menuId = Number(queryParams?.menuId);

      this.setCurrentMenuId(menuId);
      this.setCurrentUpMenuId(menuList.find(x => x.menuId === menuId)?.upMenuId);
      this.setCurrentPageTitle(menuList.find(x => x.menuId === menuId)?.menuName);
    });
  }

  /** breadcrumb 데이터를 설정한다. */
  setBreadcrumb(): void {
    combineLatest([
      this.route.queryParams,
      this.store.select<MenuResponseDTO[]>('menuList').asObservable()
    ])
    .subscribe(([queryParams, menuList]) => {
      if (menuList.length === 0) return;

      const menuId = Number(queryParams?.menuId);
      const upMenuId = menuList.find(x => x.menuId === menuId)?.upMenuId;

      this.store.update('breadcrumbList', [
        
        // 홈
        { icon: 'pi pi-home', route: '/index' },
        // 상위 메뉴
        ...menuList.filter(x => x.menuId === upMenuId).map(x => ({ label: x.menuName })),
        // 현재 메뉴
        ...menuList.filter(x => x.menuId === menuId).map(x => ({ label: x.menuName, route: x.menuUrl, queryParams: { menuId: x.menuId } })),
      ]);
    });
  }

  /** 메뉴 목록 데이터를 설정한다. */
  setMenuList(menuList: MenuResponseDTO[]): void {
    const menuTree = this.createMenuTree(menuList);
    this.store.update<MenuTree[]>('menuTree', menuTree);
    this.store.update<MenuResponseDTO[]>('menuList', menuList);
    this.store.update<boolean>('menuListDataLoad', true);
  }

  /** 현재 메뉴 ID 데이터를 설정한다. */
  setCurrentMenuId(currentMenuId: number): void {
    this.store.update<number>('currentMenuId', currentMenuId);
  }

  /** 현재 상위 메뉴 ID 데이터를 설정한다. */
  setCurrentUpMenuId(currentUpMenuId: number): void {
    this.store.update<number>('currentUpMenuId', currentUpMenuId);
  }

  /** 현재 페이지 타이틀 데이터를 설정한다. */
  setCurrentPageTitle(currentPageTitle: string): void {
    this.store.update<string>('currentPageTitle', currentPageTitle);
  }

  /** 메뉴접속이력 목록 데이터를 설정한다. */
  setMenuHistoryList(list: MenuResponseDTO[]): void {
    this.store.select<number>('currentMenuId').asObservable().subscribe((menuId) => {
      list.sort((a, b) => a.menuId === menuId ? -1 : 1); // 가장 먼저 방문한 페이지가 맨 앞에 오게 하기
      this.store.update<MenuResponseDTO[]>('menuHistoryList', list);
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
