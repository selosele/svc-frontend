import { Injectable } from '@angular/core';
import { MenuItem, TreeNode } from 'primeng/api';
import { StoreService } from '@app/shared/services';
import { MenuBookmarkResponseDTO, MenuResponseDTO, MenuTree } from './menu.model';

@Injectable({ providedIn: 'root' })
export class MenuStore extends StoreService {

  constructor() {
    super();
  }

  override init() {
    this.creates([
      { key: 'menuList', defaultValue: [] as MenuResponseDTO[] }, // 메뉴 목록
      { key: 'menuListDataLoad', defaultValue: false },           // 메뉴 목록 데이터 로드 완료 여부
      { key: 'sysMenuTree', defaultValue: [] as TreeNode[] },     // 시스템관리 > 메뉴관리 > 메뉴 트리 목록
      { key: 'sysMenuListDataLoad', defaultValue: false },        // 시스템관리 > 메뉴관리 > 메뉴 목록 데이터 로드 완료 여부
      { key: 'menuTree', defaultValue: [] as MenuTree[] },        // 메뉴 트리 목록
      { key: 'currentMenuId', defaultValue: null as number },     // 현재 메뉴 ID
      { key: 'currentUpMenuId', defaultValue: null as number },   // 현재 상위 메뉴 ID
      { key: 'currentPageTitle', defaultValue: null as string },  // 현재 페이지 타이틀
      { key: 'hasBookmark', defaultValue: false },                // 현재 메뉴가 즐겨찾기 추가되어 있는지 여부
      { key: 'menuBookmarkList', defaultValue: [] as MenuBookmarkResponseDTO[] }, // 메뉴 즐겨찾기 목록
      { key: 'menuBookmarkListDataLoad', defaultValue: false },                   // 메뉴 즐겨찾기 목록 데이터 로드 완료 여부
      { key: 'menuHistoryList', defaultValue: [] as MenuResponseDTO[] },          // 메뉴접속이력 목록
      { key: 'breadcrumbList', defaultValue: [] as MenuItem[] },                  // breadcrumb 목록
    ]);
  }

}