import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { Table, TableModule, TableRowSelectEvent, TableRowUnSelectEvent } from 'primeng/table';
import { SortEvent } from 'primeng/api';
import { deepCopy } from '@app/shared/utils';
import { UiTableButtonsComponent } from '../ui-table-buttons/ui-table-buttons.component';
import { Column } from './ui-table.model';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    UiTableButtonsComponent,
  ],
  selector: 'ui-table',
  templateUrl: './ui-table.component.html',
  styleUrl: './ui-table.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UiTableComponent {

  /** 테이블 */
  @ViewChild('table') table: Table;

  /** 테이블 타이틀 */
  @Input() title?: string;

  /** 테이블 텍스트 */
  @Input() text?: string;

  /** 테이블 행 추가 버튼 사용여부 */
  @Input() useAdd = true;

  /** 테이블 행 삭제 버튼 사용여부 */
  @Input() useRemove = true;

  /** 테이블 새로고침 버튼 사용여부 */
  @Input() useRefresh = true;

  /** 테이블 행 번호 사용여부 */
  @Input() useRowIndex = false;

  /** 테이블 행 번호 역순 정렬 사용여부 */
  @Input() useRowIndexDesc = false;

  /** 테이블 체크박스 사용여부 */
  @Input() useCheckbox = false;

  /** 테이블 라디오버튼 사용여부 */
  @Input() useRadio = false;

  /** 테이블 행 선택 모드 */
  @Input() selectionMode: 'single' | 'multiple' = 'single';

  /** 테이블 스크롤 높이 값 */
  @Input() scrollHeight?: string;

  /** 테이블 데이터 없을 시 표출할 텍스트 */
  @Input() emptymessage = '데이터가 없어요.';

  /** 테이블 컬럼 목록 */
  @Input() cols!: Column[];

  /** 테이블 데이터 */
  @Input() set data(value: any[]) {
    this._data = value ? deepCopy(value) : [];
    this.initialValue = deepCopy(this._data);
    this.isSorted = null;
    this.table?.reset();
  }

  get data() {
    return this._data;
  }

  /** 테이블 행 선택 key */
  @Input() dataKey?: any;

  /** 테이블 로딩 */
  @Input() loading?: boolean = false;

  /** 테이블 페이징 */
  @Input() paginator?: boolean = false;

  /** 테이블 페이징 row 개수 */
  @Input() rows?: number = 5;

  /** 테이블 페이징 row 페이지 옵션 */
  @Input() rowsPerPageOptions?: number[] = [5, 10, 15];

  /** 테이블 정렬 모드 */
  @Input() sortMode?: 'single' | 'multiple' = 'single';

  /** 테이블 선택된 행 */
  @Input() selection?: any;

  /** 테이블 다운로드 파일명 */
  @Input() fileName?: string;

  /** 테이블 엑셀 다운로드 헤더 */
  @Input() excelHeader?: { [key: string]: any }[];

  /** 테이블 엑셀 다운로드 버튼 사용여부 */
  @Input() useExportExcel = false;

  /** 테이블 새로고침 이벤트 */
  @Output() refresh = new EventEmitter<Event>();

  /** 테이블 행 선택 이벤트 */
  @Output() rowSelect = new EventEmitter<TableRowSelectEvent>();

  /** 테이블 행 선택 해제 이벤트 */
  @Output() unRowSelect = new EventEmitter<TableRowUnSelectEvent>();

  /** 테이블 행 더블 클릭 이벤트 */
  @Output() rowDblclick = new EventEmitter<any>();

  /** 테이블 데이터 (임시) */
  private _data: any[] = [];

  /** 테이블 colspan */
  protected get colspan() {
    let length = this.cols.length;
    if (this.useRowIndex) length += 1;
    if (this.useCheckbox) length += 1;
    if (this.useRadio)    length += 1;
    return length;
  }

  /** 테이블 데이터 초기 값 */
  private initialValue = [];

  /** 테이블 행 정렬 여부 */
  private isSorted: boolean | null = null;

  /** 테이블 새로고침 버튼을 클릭한다. */
  protected onRefresh(event: Event): void {
    this.refresh.emit(event);
  }

  /** 테이블 행을 선택한다. */
  protected onRowSelect(event: TableRowSelectEvent): void {
    this.rowSelect.emit(event);
  }

  /** 테이블 행을 선택 해제한다. */
  protected onRowUnselect(event: TableRowUnSelectEvent): void {
    this.unRowSelect.emit(event);
  }

  /** 테이블 행을 더블 클릭한다. */
  protected onRowDblclick(event: any): void {
    this.rowDblclick.emit(event);
  }

  /** 테이블 행 정렬 커스텀 이벤트 */
  protected onSort(event: SortEvent): void {
    if (this.isSorted === null || this.isSorted === undefined) {
      this.isSorted = true;
      this.sortTableData(event);
    } else if (this.isSorted === true) {
      this.isSorted = false;
      this.sortTableData(event);
    } else if (this.isSorted === false) {
      this.isSorted = null;
      this.data = [...this.initialValue];
      this.table.reset();
    }
  }

  /** 테이블 행을 정렬한다. */
  private sortTableData(event: SortEvent): void {
    event.data.sort((data1, data2) => {
      const value1 = data1[event.field];
      const value2 = data2[event.field];
      let result = null;

      if (value1 === null && value2 !== null) result = -1;
      else if (value1 !== null && value2 === null) result = 1;
      else if (value1 === null && value2 === null) result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string') result = value1.localeCompare(value2);
      else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

      return event.order * result;
    });
  }

  /** 행 번호를 설정한다. */
  protected getRowIndex(rowIndex: number): number {
    if (this.useRowIndexDesc) {
      return this.data.length - rowIndex;
    }
    return rowIndex + 1;
  }

}
