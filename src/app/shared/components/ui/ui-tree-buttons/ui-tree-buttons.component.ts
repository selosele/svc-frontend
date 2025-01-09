import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiButtonComponent } from '../ui-button/ui-button.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    UiButtonComponent,
  ],
  selector: 'ui-tree-buttons',
  templateUrl: './ui-tree-buttons.component.html',
  styleUrl: './ui-tree-buttons.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UiTreeButtonsComponent {

  /** tree 새로고침 버튼 사용여부 */
  @Input() useRefresh = true;

  /** tree 새로고침 이벤트 */
  @Output() refresh = new EventEmitter<Event>();

  /** 테이블 새로고침 버튼을 클릭한다. */
  protected onRefresh(event: Event): void {
    this.refresh.emit(event);
  }

}
