import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UiButtonComponent } from '../ui-button/ui-button.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    UiButtonComponent,
  ],
  selector: 'ui-data-grid-buttons',
  templateUrl: './ui-data-grid-buttons.component.html',
  styleUrl: './ui-data-grid-buttons.component.scss'
})
export class UiDataGridButtonsComponent {

  /** grid 행 추가 버튼 사용여부 */
  @Input() useAdd = true;

  /** grid 행 삭제 버튼 사용여부 */
  @Input() useRemove = true;

  /** grid 새로고침 이벤트 */
  @Output() refresh = new EventEmitter<Event>();

  /** grid 새로고침 버튼을 클릭한다. */
  onRefresh(event: Event): void {
    event.stopPropagation();
    this.refresh.emit(event);
  }

}
