import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { TreeTable, TreeTableModule, TreeTableNodeExpandEvent, TreeTableNodeUnSelectEvent } from 'primeng/treetable';
import { TreeNode, TreeTableNode } from 'primeng/api';
import { deepCopy } from '@app/shared/utils';
import { UiTableButtonsComponent } from '../ui-table-buttons/ui-table-buttons.component';
import { UiTextComponent } from '../ui-text/ui-text.component';
import { Column } from './ui-tree-table.model';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TreeTableModule,
    UiTableButtonsComponent,
    UiTextComponent,
  ],
  selector: 'ui-tree-table',
  templateUrl: './ui-tree-table.component.html',
  styleUrl: './ui-tree-table.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UiTreeTableComponent {

  /** 트리테이블 */
  @ViewChild('treeTable') treeTable: TreeTable;

  /** 트리테이블 타이틀 */
  @Input() title?: string;

  /** 트리테이블 텍스트 */
  @Input() text?: string;

  /** 트리테이블 행 추가 버튼 사용여부 */
  @Input() useAdd = true;

  /** 트리테이블 행 삭제 버튼 사용여부 */
  @Input() useRemove = true;

  /** 트리테이블 새로고침 버튼 사용여부 */
  @Input() useRefresh = true;

  /** 트리테이블 행 선택 모드 */
  @Input() selectionMode: 'single' | 'multiple' = 'single';

  /** 트리테이블 스크롤 높이 값 */
  @Input() scrollHeight = '400px';

  /** 트리테이블 데이터 없을 시 표출할 텍스트 */
  @Input() emptymessage = '데이터가 없어요.';

  /** 트리테이블 컬럼 목록 */
  @Input() cols!: Column[];

  /** 트리테이블 데이터 */
  @Input()
  set data(value: any[]) {
    this._data = value ? deepCopy(value) : [];
    this.initialValue = deepCopy(this._data);
    this.isSorted = null;
    this.treeTable?.reset();
  }

  get data() {
    return this._data;
  }

  /** 트리테이블 행 선택 key */
  @Input() dataKey?: any;

  /** 트리테이블 로딩 */
  @Input() loading?: boolean = false;

  /** 트리테이블 페이징 */
  @Input() paginator?: boolean = false;

  /** 트리테이블 페이징 row 개수 */
  @Input() rows?: number = 5;

  /** 트리테이블 페이징 row 페이지 옵션 */
  @Input() rowsPerPageOptions?: number[] = [5, 10, 15];

  /** 트리테이블 정렬 모드 */
  @Input() sortMode?: 'single' | 'multiple' = 'single';

  /** 트리테이블 필터 모드 */
  @Input() filterMode?: 'lenient' | 'strict' = 'lenient';

  /** 트리테이블 선택된 행 */
  @Input() selection?: TreeNode;

  /** 트리테이블 다운로드 파일명 */
  @Input() fileName?: string;

  /** 트리테이블 엑셀 다운로드 헤더 */
  @Input() excelHeader?: { [key: string]: string }[];

  /** 트리테이블 엑셀 다운로드 버튼 사용여부 */
  @Input() useExportExcel = false;

  /** 트리테이블 새로고침 이벤트 */
  @Output() refresh = new EventEmitter<Event>();

  /** 트리테이블 행 선택 이벤트 */
  @Output() nodeSelect = new EventEmitter<TreeTableNode>();

  /** 트리테이블 행 선택 해제 이벤트 */
  @Output() nodeUnSelect = new EventEmitter<TreeTableNodeUnSelectEvent>();

  /** 트리테이블 행 그룹 펼치기 이벤트 */
  @Output() nodeExpand = new EventEmitter<TreeTableNodeUnSelectEvent>();

  /** 테이블 행 더블 클릭 이벤트 */
  @Output() rowDblclick = new EventEmitter<any>();

  /** 테이블 데이터 (임시) */
  private _data: any[] = [];

  /** 트리테이블 colspan */
  protected get colspan() {
    return this.cols.length;
  }

  /** 트리테이블 데이터 초기 값 */
  private initialValue = [];

  /** 트리테이블 행 정렬 여부 */
  private isSorted: boolean | null = null;

  /** 트리테이블 새로고침 버튼을 클릭한다. */
  protected onRefresh(event: Event): void {
    this.refresh.emit(event);
  }

  /** 트리테이블 행을 선택한다. */
  protected onNodeSelect(event: TreeTableNode): void {
    this.nodeSelect.emit(event);
  }

  /** 트리테이블 행을 선택 해제한다. */
  protected onNodeUnselect(event: TreeTableNodeUnSelectEvent): void {
    this.nodeUnSelect.emit(event);
  }

  /** 트리테이블 행 그룹을 펼친다. */
  protected onNodeExpand(event: TreeTableNodeExpandEvent): void {
    this.nodeExpand.emit(event);
  }

  /** 트리테이블 행 그룹 펼치기 버튼을 클릭한다. */
  protected onTogglerClick(event: Event): void {
    event.stopPropagation(); // 펼치기 버튼 클릭 시, 행선택 이벤트가 동시에 발생하는 이슈를 방지
  }

  /** 트리테이블 행을 필터링한다. */
  protected onFilterInput(event: Event, col: any): void {
    return this.treeTable.filter((event.target as HTMLInputElement).value, col.field, col.filterMatchMode);
  }

  /** 테이블 행을 더블 클릭한다. */
  protected onRowDblclick(event: any): void {
    this.rowDblclick.emit(event);
  }

  /** 트리테이블 행 정렬 커스텀 이벤트 */
  protected onSort(event: any): void {
    if (this.isSorted === null || this.isSorted === undefined) {
      this.isSorted = true;
      this.sortTreeTableData(event);
    } else if (this.isSorted === true) {
      this.isSorted = false;
      this.sortTreeTableData(event);
    } else if (this.isSorted === false) {
      this.isSorted = null;
      this.data = [...this.initialValue];
      this.treeTable.reset();
    }
  }
  
  /** 트리테이블 행을 정렬한다. */
  private sortTreeTableData(event: any): void {
    event.data?.sort((data1, data2) => {
      const value1 = data1.data[event.field];
      const value2 = data2.data[event.field];
      let result = null;

      if (value1 === null && value2 !== null) result = -1;
      else if (value1 !== null && value2 === null) result = 1;
      else if (value1 === null && value2 === null) result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string') result = value1.localeCompare(value2);
      else result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

      return event.order * result;
    });
  }

}
