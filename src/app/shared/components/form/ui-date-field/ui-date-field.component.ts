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

  override ngOnInit(): void {
    super.ngOnInit();
  }

}
