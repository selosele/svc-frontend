import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
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

  /** 닫기 버튼 클릭 이벤트 */
  @Output() close = new EventEmitter<Event>();

  /** 닫기 버튼을 클릭해서 splitter를 비활성화한다. */
  protected onClose(event: Event): void {
    this.close.emit(event);
  }

}
