import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import FileSaver from 'file-saver';
import { UiButtonComponent } from '../ui-button/ui-button.component';
import { UiContentTitleComponent } from '../ui-content-title/ui-content-title.component';
import { numberWithCommas } from '@app/shared/utils';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    UiButtonComponent,
    UiContentTitleComponent,
  ],
  selector: 'ui-table-buttons',
  templateUrl: './ui-table-buttons.component.html',
  styleUrl: './ui-table-buttons.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UiTableButtonsComponent {

  /** 테이블 데이터 */
  @Input() value?: any;

  /** 테이블 다운로드 파일명 */
  @Input() fileName?: string;

  /** 테이블 엑셀 다운로드 헤더 */
  @Input() excelHeader?: { [key: string]: string }[];

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

  /** 테이블 엑셀 다운로드 버튼 사용여부 */
  @Input() useExportExcel = false;

  /** 테이블 새로고침 이벤트 */
  @Output() refresh = new EventEmitter<Event>();

  /** 테이블 엑셀 다운로드 이벤트 */
  @Output() exportExcel = new EventEmitter<Event>();

  /** 테이블 새로고침 버튼을 클릭한다. */
  protected onRefresh(event: Event): void {
    this.refresh.emit(event);
  }

  /** 테이블 엑셀 다운로드 버튼을 클릭한다. */
  protected onExportExcel(event: Event): void {
    import('xlsx').then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.createExcelData());
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, this.fileName);
      this.exportExcel.emit(event);
    });
  }

  /** 엑셀 파일로 저장한다. */
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }

  /** 엑셀 다운로드 데이터를 생성해서 반환한다. */
  private createExcelData(): any {
    if (!this.excelHeader) {
      return this.value;
    }
  
    const transformedData = this.value.map(x => {
      const transformedItem = {};
      this.excelHeader.forEach(header => {
        const key = Object.keys(header)[0]; // 데이터 키
        const columnName = header[key];     // 컬럼명
        const numberFormat = header._numberFormat || 'N'; // 숫자 포맷 여부
  
        if (x.hasOwnProperty(key)) {
          let value = x[key];
          if (numberFormat === 'Y' && typeof value === 'number') {
            value = numberWithCommas(value);
          }
          transformedItem[columnName] = value;
        }
      });
      return transformedItem;
    });
  
    return transformedData;
  }

}
