import { Component, OnInit, ViewChild } from '@angular/core';
import { LayoutPageDescriptionComponent } from '@app/shared/components/layout';
import { UiButtonComponent, UiSkeletonComponent, UiSplitterComponent, UiTableComponent } from '@app/shared/components/ui';
import { StoreService } from '@app/shared/services';
import { BoardService } from '@app/board/board.service';
import { BoardResponseDTO } from '@app/board/board.model';
import { SystemBoardDetailComponent } from './system-board-detail/system-board-detail.component';

@Component({
  standalone: true,
  imports: [
    UiSkeletonComponent,
    UiSplitterComponent,
    UiTableComponent,
    UiButtonComponent,
    LayoutPageDescriptionComponent,
    SystemBoardDetailComponent,
  ],
  selector: 'view-system-board',
  templateUrl: './system-board.component.html',
  styleUrl: './system-board.component.scss'
})
export class SystemBoardComponent implements OnInit {

  constructor(
    private store: StoreService,
    private boardService: BoardService,
  ) {}

  /** splitter */
  @ViewChild('splitter') splitter: UiSplitterComponent;

  /** 게시판 목록 */
  get boardList(): BoardResponseDTO[] {
    return this.store.select<BoardResponseDTO[]>('boardList').value;
  }

  /** 게시판 목록 데이터 로드 완료 여부 */
  get boardListDataLoad() {
    return this.store.select<boolean>('boardListDataLoad').value;
  }

  /** 게시판 정보 */
  detail: BoardResponseDTO = null;

  /** 테이블 선택된 행 */
  selection: BoardResponseDTO;

  /** 테이블 컬럼 */
  cols = [
    { field: 'boardId',           header: '게시판 ID' },
    { field: 'boardName',         header: '게시판명' },
    { field: 'boardTypeCodeName', header: '게시판 구분' },
    { field: 'useYn',             header: '사용 여부' },
  ];

  ngOnInit() {
    if (!this.boardListDataLoad) {
      this.listBoard();
    }
  }

  /** 게시판 목록을 조회한다. */
  listBoard(): void {
    this.boardService.listBoard();
  }

  /** 게시판을 추가한다. */
  addBoard(): void {
    this.detail = {};
    this.splitter.show();
  }

  /** 게시판 테이블 행을 선택한다. */
  onRowSelect(event: any): void {
    this.boardService.getBoard$(event.data['boardId'])
    .subscribe((data) => {
      this.detail = data;
      this.splitter.show();
    });
  }

  /** 테이블 행을 선택 해제한다. */
  onRowUnselect(event: any): void {
    this.detail = {};
    this.splitter.hide();
  }

  /** 테이블 새로고침 버튼을 클릭한다. */
  onRefresh(): void {
    this.listBoard();
  }

  /** 삭제 버튼을 클릭한다. */
  onRemove(): void {
    this.splitter.hide();
    this.listBoard();
  }

  /** 닫기 버튼을 클릭한다. */
  onClose(): void {
    this.splitter.hide();
  }

}
