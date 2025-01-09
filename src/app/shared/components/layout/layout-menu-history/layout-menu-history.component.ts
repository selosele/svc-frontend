import { AfterViewChecked, Component, ElementRef, HostListener, NgZone, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { combineLatest } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { StoreService } from '@app/shared/services';
import { MenuService } from '@app/menu/menu.service';
import { MenuResponseDTO } from '../../../../menu/menu.model';
import { UiButtonComponent } from '../../ui';
import { isEmpty, isNotEmpty } from '@app/shared/utils';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ContextMenuModule,
    UiButtonComponent,
  ],
  selector: 'layout-menu-history',
  templateUrl: './layout-menu-history.component.html',
  styleUrl: './layout-menu-history.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LayoutMenuHistoryComponent implements OnInit, AfterViewChecked {

  constructor(
    private zone: NgZone,
    private store: StoreService,
    private route: ActivatedRoute,
    private menuService: MenuService,
  ) {}
  
  /** 컨텍스트 메뉴 */
  @ViewChild('cm') cm: ContextMenu;

  /** layout-menu-history 요소 */
  @ViewChild('lmh') lmh: ElementRef<HTMLElement>;

  /** 컨텍스트 메뉴 목록 */
  contextMenus: MenuItem[] = [];

  /** 메뉴 ID */
  menuId: number;

  /** 컨텍스트 메뉴로 선택한 메뉴 ID */
  cmMenuId: number;

  /** 마지막 scroll top */
  lastScrollTop = 0;

  /** 스크롤 중인지 여부 */
  isScroll = false;

  /** 메뉴접속이력 목록 */
  get menuHistoryList() {
    return this.store.select<MenuResponseDTO[]>('menuHistoryList').value;
  }

  /** 메뉴접속이력 로컬스토리지 목록 */
  get menuHistoryStorageList(): MenuResponseDTO[] {
    return JSON.parse(window.localStorage.getItem(this.menuService.MENU_HISTORY_LIST_KEY))
      ?? [];
  }

  ngOnInit() {
    this.contextMenus = [
      { label: '삭제', icon: 'pi pi-trash', command: () => this.onRemove(this.cmMenuId) },
      { label: '전체 삭제', icon: 'pi pi-trash', command: () => this.removeAll() },
    ];

    if (this.menuHistoryStorageList.length > 0) {
      this.store.update('menuHistoryList', this.menuHistoryStorageList);
    }

    combineLatest([
      this.route.queryParams,
      this.store.select<MenuResponseDTO[]>('menuList').asObservable()
    ])
    .subscribe(([queryParams, menuList]) => {
      if (menuList.length === 0) return;

      this.menuId = Number(queryParams?.menuId);
      if (isEmpty(this.menuId) || isNaN(this.menuId)) return;

      // 현재 메뉴 URL을 가져온다.
      const menuUrl = menuList.find(x => x.menuId === this.menuId)?.menuUrl;
    
      // 현재 메뉴명을 가져온다.
      const menuName = menuList.find(x => x.menuId === this.menuId)?.menuName;

      // 같은 메뉴접속이력 데이터가 존재하는지 확인한다.
      const hasExist = isNotEmpty(this.menuHistoryStorageList.find(x => x.menuId === this.menuId));
      if (hasExist) return;
  
      // 메뉴접속이력 데이터를 쌓아 넣는다.
      this.menuService.setMenuHistoryList([...this.menuHistoryStorageList, { menuId: this.menuId, menuUrl, menuName }]);
    });
  }

  ngAfterViewChecked() {
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.detectScrollEnd();
      });
    });
  }

  /** 삭제 버튼을 클릭해서 메뉴접속이력을 삭제한다. */
  onRemove(menuId: number): void {
    this.menuService.setMenuHistoryList(this.menuHistoryList.filter(x => x.menuId !== menuId));
  }

  /** 모든 메뉴접속이력을 삭제한다. */
  removeAll(): void {
    this.menuService.setMenuHistoryList([]);
  }

  /** 마우스 오른쪽을 클릭한다. */
  onContextMenu(event: any, menuId: number): void {
    this.cmMenuId = menuId;
    //this.cm.target = event.currentTarget;
    this.cm.show(event);
  }
  
  /** 페이지 맨 하단으로 스크롤했는지 감지한다. */
  detectScrollEnd(): void {
    if (this.lmh) {
      const lmhBottom = this.lmh.nativeElement.getBoundingClientRect().bottom;
      this.isScroll = lmhBottom >= window.innerHeight;
    } else {
      this.isScroll = false;
    }
  }

  /** 페이지 맨 하단으로 스크롤 시, scroll 클래스를 추가한다. */
  @HostListener('document:scroll', ['$event'])
  onDocumentScroll(event: Event): void {
    if (window.scrollY < 0) return;
    this.detectScrollEnd();
  }

}
