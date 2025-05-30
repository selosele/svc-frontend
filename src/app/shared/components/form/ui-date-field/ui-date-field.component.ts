import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
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

  /** input readonly */
  @Input() readonlyInput = false;

  /** 날짜 선택 구분 */
  @Input() view?: 'date' | 'month' | 'year' = 'date';

  /** 날짜 선택 모드 */
  @Input() selectionMode?: 'single' | 'multiple' | 'range' = 'single';

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

  /** change 이벤트 */
  @Output() input? = new EventEmitter<any>();

  /** blur 이벤트 */
  @Output() blur? = new EventEmitter<Event>();

  /** select 이벤트 */
  @Output() select? = new EventEmitter<Date>();

  /** clear 이벤트 */
  @Output() clear? = new EventEmitter<any>();

  /** clear 버튼 클릭 이벤트 */
  @Output() clearClick? = new EventEmitter<any>();

  override ngOnInit() {
    super.ngOnInit();

    // readonly일 때는 캘린더를 표출할 수 없도록 한다.
    if (this.readonly) {
      this.showIcon = false;
      this.showClear = false;
      this.showOnFocus = false;
    }
  }

  /** change 이벤트 */
  protected onInput(event: any): void {
    this.setErrorMessage();
    this.input.emit(event);
  }

  /** change 이벤트 */
  protected onBlur(event: Event): void {
    this.setErrorMessage();
    this.blur.emit(event);
  }

  /** select 이벤트 */
  protected onSelect(event: Date): void {
    this.setErrorMessage();
    this.select.emit(event);
  }

  /** clear 이벤트 */
  protected onClear(event: any): void {
    this.setErrorMessage();
    this.clear.emit(event);
  }

  /** clear 버튼 클릭 이벤트 */
  protected onClearClick(event: any): void {
    this.setErrorMessage();
    this.clearClick.emit(event);
  }

}
