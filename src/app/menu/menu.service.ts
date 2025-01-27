import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';
import { MenuItem, TreeNode } from 'primeng/api';
import { HttpService, StoreService } from '@app/shared/services';
import { GetMenuRequestDTO, MenuBookmarkResponseDTO, MenuResponseDTO, MenuTree, SaveMenuBookmarkRequestDTO, SaveMenuRequestDTO } from '@app/menu/menu.model';
import { MAIN_PAGE_PATH2 } from '@app/shared/utils';

@Injectable({ providedIn: 'root' })
export class MenuService {

  constructor(
    private http: HttpClient,
    private httpService: HttpService,
    private route: ActivatedRoute,
    private store: StoreService,
  ) {}

  /** 메뉴 ID 정보 */
  public menuIdInfo = {

    // 휴가관리
    VACATIONS: 2,

    // 마이페이지
    MY_PAGE: 14,

  };

  /** 메뉴접속이력 목록 저장 key */
  public readonly MENU_HISTORY_LIST_KEY = 'menuHistoryList';

  /** 메뉴 목록 */
  private menuList = this.store.create<MenuResponseDTO[]>('menuList', []);

  /** 메뉴 목록 데이터 로드 완료 여부 */
  private menuListDataLoad = this.store.create<boolean>('menuListDataLoad', false);

  /** 시스템관리 > 메뉴관리 > 메뉴 트리 목록 */
  private sysMenuTree = this.store.create<TreeNode[]>('sysMenuTree', []);

  /** 시스템관리 > 메뉴관리 > 메뉴 목록 데이터 로드 완료 여부 */
  private sysMenuListDataLoad = this.store.create<boolean>('sysMenuListDataLoad', false);

  /** 메뉴 트리 목록 */
  private menuTree = this.store.create<MenuTree[]>('menuTree', []);

  /** 현재 메뉴 ID */
  private currentMenuId = this.store.create<number>('currentMenuId', null);

  /** 현재 상위 메뉴 ID */
  private currentUpMenuId = this.store.create<number>('currentUpMenuId', null);

  /** 현재 페이지 타이틀 */
  private currentPageTitle = this.store.create<string>('currentPageTitle', null);

  /** 현재 메뉴가 즐겨찾기 추가되어 있는지 여부 */
  private hasBookmark = this.store.create<boolean>('hasBookmark', false);

  /** 메뉴 즐겨찾기 목록 */
  private menuBookmarkList = this.store.create<MenuBookmarkResponseDTO[]>('menuBookmarkList', []);

  /** 메뉴 즐겨찾기 목록 데이터 로드 완료 여부 */
  private menuBookmarkListDataLoad = this.store.create<boolean>('menuBookmarkListDataLoad', false);

  /** 메뉴접속이력 목록 */
  private menuHistoryList = this.store.create<MenuResponseDTO[]>('menuHistoryList', []);

  /** breadcrumb 목록 */
  private breadcrumbList = this.store.create<MenuItem[]>('breadcrumbList', []);

  /** 메뉴 목록을 조회한다. */
  listMenu(dto?: GetMenuRequestDTO): void {
    const params = this.httpService.createParams(dto);

    this.http.get<MenuResponseDTO[]>('/co/menus', { params })
    .subscribe((data) => {
      this.setMenuList(data);
    });
  }

  /** 메뉴 목록을 조회한다. */
  listMenu$(dto?: GetMenuRequestDTO) {
    const params = this.httpService.createParams(dto);
    return this.http.get<MenuResponseDTO[]>('/co/menus', { params });
  }

  /** 시스템관리 > 메뉴관리 > 메뉴 목록을 조회한다. */
  listSysMenu$(dto?: GetMenuRequestDTO) {
    const params = this.httpService.createParams(dto);
    return this.http.get<MenuResponseDTO[]>('/co/menus/sys', { params });
  }

  /** 권한별 메뉴 목록을 조회한다. */
  listMenuByRole$(dto?: GetMenuRequestDTO) {
    const params = this.httpService.createParams(dto);
    return this.http.get<MenuResponseDTO[]>('/co/menus', { params });
  }

  /** 메뉴를 조회한다. */
  getMenu$(menuId: number) {
    return this.http.get<MenuResponseDTO>(`/co/menus/${menuId}`);
  }

  /** 메뉴를 추가한다. */
  addMenu$(dto: SaveMenuRequestDTO) {
    return this.http.post<MenuResponseDTO>('/co/menus', dto);
  }

  /** 메뉴를 수정한다. */
  updateMenu$(dto: SaveMenuRequestDTO) {
    const { menuId } = dto;
    return this.http.put<MenuResponseDTO>(`/co/menus/${menuId}`, dto);
  }

  /** 메뉴를 삭제한다. */
  removeMenu$(menuId: number) {
    return this.http.delete<void>(`/co/menus/${menuId}`);
  }

  /** 메뉴 즐겨찾기 목록을 조회한다. */
  listMenuBookmark(): void {
    this.http.get<MenuBookmarkResponseDTO[]>('/co/menubookmarks')
    .subscribe((data) => {
      this.store.update('menuBookmarkList', data);
      this.store.update('menuBookmarkListDataLoad', true);
    });
  }

  /** 메뉴 즐겨찾기를 추가한다. */
  addMenuBookmark$(dto: SaveMenuBookmarkRequestDTO) {
    return this.http.post<MenuBookmarkResponseDTO>('/co/menubookmarks', dto);
  }

  /** 모든 메뉴 즐겨찾기를 삭제한다. */
  removeMenuBookmarkAll$() {
    return this.http.delete<void>('/co/menubookmarks');
  }

  /** 메뉴 즐겨찾기를 삭제한다. */
  removeMenuBookmark$(menuBookmarkId: number) {
    return this.http.delete<void>(`/co/menubookmarks/${menuBookmarkId}`);
  }

  /** 메뉴 관련 데이터를 설정한다. */
  setData(): void {
    combineLatest([
      this.route.queryParams,
      this.store.select<MenuResponseDTO[]>('menuList').asObservable()
    ])
    .subscribe(([queryParams, menuList]) => {
      if (menuList.length === 0) return;

      let menuId = Number(queryParams?.menuId);
      if (isNaN(menuId)) menuId = null;

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
        { icon: 'pi pi-home', route: MAIN_PAGE_PATH2 },
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
    this.store.update('menuTree', menuTree);
    this.store.update('menuList', menuList);
    this.store.update('menuListDataLoad', true);
  }

  /** 현재 메뉴 ID 데이터를 설정한다. */
  setCurrentMenuId(currentMenuId: number): void {
    this.store.update('currentMenuId', currentMenuId);
  }

  /** 현재 상위 메뉴 ID 데이터를 설정한다. */
  setCurrentUpMenuId(currentUpMenuId: number): void {
    this.store.update('currentUpMenuId', currentUpMenuId);
  }

  /** 현재 페이지 타이틀 데이터를 반환한다. */
  getCurrentPageTitle$() {
    return this.currentPageTitle;
  }

  /** 현재 페이지 타이틀 데이터를 설정한다. */
  setCurrentPageTitle(currentPageTitle: string): void {
    this.store.update('currentPageTitle', currentPageTitle);
  }

  /** 메뉴접속이력 목록 데이터를 설정한다. */
  setMenuHistoryList(list: MenuResponseDTO[]): void {
    //list.sort((a, b) => a.menuId === menuId ? -1 : 1); // 가장 먼저 방문한 페이지가 맨 앞에 오게 하기
    this.store.update('menuHistoryList', list);
    window.localStorage.setItem(this.MENU_HISTORY_LIST_KEY, JSON.stringify(list));
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

  /** 시스템관리 > 메뉴관리 > 메뉴트리를 생성한다. */
  createSysMenuTree(data: MenuResponseDTO[], upMenuId = null): TreeNode[] {
    const tree: TreeNode[] = [];

    for (const menu of data) {
      if (menu.upMenuId === upMenuId) {
        const children = this.createSysMenuTree(data, menu.menuId);
        tree.push({
          key: `${menu.menuId}`,
          label: menu.menuName,
          children,
        });
      }
    }
    return tree;
  }

}
