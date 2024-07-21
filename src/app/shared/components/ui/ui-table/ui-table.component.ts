import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { UiTableButtonsComponent } from '../ui-table-buttons/ui-table-buttons.component';
import { UiSkeletonComponent } from '../ui-skeleton/ui-skeleton.component';
import { Column } from '@app/shared/models';
import { SortEvent } from 'primeng/api';
import { deepCopy } from '@app/shared/utils';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    UiTableButtonsComponent,
    UiSkeletonComponent,
  ],
  selector: 'ui-table',
  templateUrl: './ui-table.component.html',
  styleUrl: './ui-table.component.scss'
})
export class UiTableComponent implements OnInit {

  /** 테이블 */
  @ViewChild('table') table: Table;

  /** 테이블 행 추가 버튼 사용여부 */
  @Input() useAdd = true;

  /** 테이블 행 삭제 버튼 사용여부 */
  @Input() useRemove = true;

  /** 테이블 row index 사용여부 */
  @Input() useRowIndex = false;

  /** 테이블 체크박스 사용여부 */
  @Input() useCheckbox = false;

  /** 테이블 행 선택 모드 */
  @Input() selectionMode: 'single' | 'multiple' = 'single';

  /** 테이블 스크롤 높이 값 */
  @Input() scrollHeight = '400px';

  /** 테이블 컬럼 목록 */
  @Input() cols!: Column[];

  /** 테이블 데이터 */
  @Input() data?: any;

  /** 테이블 행 선택 key */
  @Input() dataKey?: any;

  /** 테이블 로딩 */
  @Input() loading?: boolean = false;

  /** 테이블 정렬 모드 */
  @Input() sortMode?: 'single' | 'multiple' = 'single';

  /** 테이블 선택된 행 */
  @Input() selection?: any;

  /** 테이블 새로고침 이벤트 */
  @Output() refresh = new EventEmitter<Event>();

  /** 테이블 선택 이벤트 */
  @Output() rowSelect = new EventEmitter<any>();

  /** 테이블 선택 해제 이벤트 */
  @Output() unRowSelect = new EventEmitter<any>();

  /** 테이블 데이터 초기 값 */
  private initialValue = [];

  /** 테이블 행 정렬 여부 */
  private isSorted: boolean = null;

  ngOnInit(): void {
    this.initialValue = deepCopy(this.data);
  }

  /** 테이블 새로고침 버튼을 클릭한다. */
  protected onRefresh(event: Event): void {
    this.refresh.emit(event);
  }

  /** 테이블 행을 선택한다. */
  protected onRowSelect(event: any): void {
    this.rowSelect.emit(event);
  }

  /** 테이블 행을 선택 해제한다. */
  protected onRowUnselect(event: any): void {
    this.unRowSelect.emit(event);
  }

  /** 테이블 행 정렬 커스텀 이벤트 */
  protected onSort(event: SortEvent): void {
    if (this.isSorted == null || this.isSorted === undefined) {
      this.isSorted = true;
      this.sortTableData(event);
    } else if (this.isSorted == true) {
      this.isSorted = false;
      this.sortTableData(event);
    } else if (this.isSorted == false) {
      this.isSorted = null;
      this.data = [...this.initialValue];
      this.table.reset();
    }
  }

  /** 테이블 행을 정렬한다. */
  private sortTableData(event: SortEvent): void {
    event.data.sort((data1, data2) => {
      let value1 = data1[event.field];
      let value2 = data2[event.field];
      let result = null;
      if (value1 == null && value2 != null) result = -1;
      else if (value1 != null && value2 == null) result = 1;
      else if (value1 == null && value2 == null) result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string') result = value1.localeCompare(value2);
      else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

      return event.order * result;
    });
  }

}
