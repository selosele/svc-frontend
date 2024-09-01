import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { UiFormComponent } from '../ui-form/ui-form.component';
import { UiButtonComponent } from '../../ui';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    UiButtonComponent,
  ],
  selector: 'ui-split-form',
  templateUrl: './ui-split-form.component.html',
  styleUrl: './ui-split-form.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UiSplitFormComponent extends UiFormComponent {

  /** 저장 버튼 사용 여부 */
  @Input() useSubmit = true;

  /** 삭제 버튼 사용 여부 */
  @Input() useRemove = false;

  /** 삭제 버튼 클릭 이벤트 */
  @Output() remove = new EventEmitter<Event>();

  /** 닫기 버튼 클릭 이벤트 */
  @Output() close = new EventEmitter<Event>();

  /** 삭제 버튼을 클릭한다. */
  protected onRemove(event: Event): void {
    this.remove.emit(event);
  }

  /** 닫기 버튼을 클릭해서 splitter를 비활성화한다. */
  protected onClose(event: Event): void {
    this.close.emit(event);
  }

}
