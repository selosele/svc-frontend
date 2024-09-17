import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { FormFieldComponent } from '../form-field/form-field.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CalendarModule,
  ],
  selector: 'ui-date-field',
  templateUrl: './ui-date-field.component.html',
  styleUrl: './ui-date-field.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UiDateFieldComponent extends FormFieldComponent {

  /** 날짜 포맷 */
  @Input() dateFormat = 'yy.mm.dd';

  /** 날짜 데이터타입 */
  @Input() dataType = 'string';

  /** 날짜 선택 버튼 표출 여부 */
  @Input() showIcon = true;

  /** 날짜 삭제 버튼 표출 여부 */
  @Input() showClear = true;

  /** 하단 버튼 표출 여부 */
  @Input() showButtonBar = true;

  /** focus시 캘린더 표출 여부 */
  @Input() showOnFocus = true;

  /** 캘린더 팝업 위치 */
  @Input() appendTo = 'body';

  override ngOnInit() {
    super.ngOnInit();

    // readonly일 때는 캘린더를 표출할 수 없도록 한다.
    if (this.readonly) {
      this.showIcon = false;
      this.showClear = false;
      this.showOnFocus = false;
    }
  }

}
