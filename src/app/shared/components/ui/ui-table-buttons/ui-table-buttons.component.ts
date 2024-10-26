import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { UiButtonComponent } from '../ui-button/ui-button.component';
import { UiContentTitleComponent } from '../ui-content-title/ui-content-title.component';

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

  /** 테이블 새로고침 이벤트 */
  @Output() refresh = new EventEmitter<Event>();

  /** 테이블 새로고침 버튼을 클릭한다. */
  protected onRefresh(event: Event): void {
    this.refresh.emit(event);
  }

}
