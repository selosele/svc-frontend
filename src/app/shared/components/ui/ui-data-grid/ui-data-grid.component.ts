import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from '@ag-grid-community/angular';
import { GridApi, GridReadyEvent, Module } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model'

@Component({
  standalone: true,
  imports: [
    CommonModule,
    AgGridAngular,
  ],
  selector: 'ui-data-grid',
  templateUrl: './ui-data-grid.component.html',
  styleUrl: './ui-data-grid.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UiDataGridComponent implements OnInit {

  /** grid width 값 */
  @Input() width = '100%';

  /** grid height 값 */
  @Input() height = '500px';

  /** 컬럼 목록 */
  @Input() columnDefs: any[];

  /** row 목록 */
  @Input() rowData: any[];
  
  /** grid ready 이벤트 */
  @Output() gridReady = new EventEmitter<GridApi>();

  /** grid 모듈 */
  modules: Module[] = [ClientSideRowModelModule];

  /** grid 스타일 */
  style: any = {
    width: '100%',
    height: '100%',
    flex: '1 1 auto',
  };

  /** 데이터 로딩 중일 때 표출할 메시지 */
  overlayLoadingTemplate: string = `<span>로딩 중입니다. 조금만 기다려주세요.</span>`;

  /** 데이터 없을 때 표출할 메시지 */
  overlayNoRowsTemplate: string = `<span>데이터가 없습니다.</span>`;

  /** grid api */
  private gridApi!: GridApi;

  ngOnInit(): void {
    this.setGridWidthAndHeight(this.width, this.height);
  }

  /** grid ready 이벤트 */
  onGridReady(params: GridReadyEvent<any, any>): void {
    this.gridApi = params.api;
    this.gridApi.updateGridOptions({
      columnDefs: this.columnDefs.map((column) => {
        if (column.field === 'rowNum')
          return { ...column, headerName: 'No', valueGetter: 'node.rowIndex + 1' };
        return column;
      }),
    });
    this.gridReady.emit(this.gridApi);
  }

  /** grid의 width 값과 height 값을 설정한다. */
  setGridWidthAndHeight(width: string, height: string): void {
    this.style = {
      width: width,
      height: height,
    };
  }

}
