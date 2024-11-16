import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteCompleteEvent, AutoCompleteModule, AutoCompleteSelectEvent, AutoCompleteUnselectEvent } from 'primeng/autocomplete';
import { TooltipModule } from 'primeng/tooltip';
import { FormFieldComponent } from '../form-field/form-field.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AutoCompleteModule,
    TooltipModule,
  ],
  selector: 'ui-autocomplete-field',
  templateUrl: './ui-autocomplete-field.component.html',
  styleUrl: './ui-autocomplete-field.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UiAutocompleteFieldComponent extends FormFieldComponent {

  /** 드롭다운 사용여부 */
  @Input() dropdown = false;

  /** 검색어 초기화 버튼 사용여부 */
  @Input() showClear = true;

  /** 검색어 초기화 버튼 사용여부 */
  @Input() optionLabel?: string;

  /** 검색결과 없을시 표출할 메시지 */
  @Input() emptyMessage?: string;

  /** 검색결과 없을시 메시지 표출 여부 */
  @Input() showEmptyMessage = true;

  /** 자동완성필드 데이터 목록 */
  @Input() data: any[];

  /** 자동완성 이벤트 */
  @Output() complete? = new EventEmitter<AutoCompleteCompleteEvent>();

  /** 드롭다운 항목 선택 이벤트 */
  @Output() select? = new EventEmitter<AutoCompleteSelectEvent>();

  /** 드롭다운 항목 선택해제 이벤트 */
  @Output() unSelect? = new EventEmitter<AutoCompleteUnselectEvent>();

  /** keyup 이벤트 */
  @Output() keyup? = new EventEmitter<KeyboardEvent>();

  override ngOnInit() {
    super.ngOnInit();
  }

  /** 자동완성 이벤트 */
  protected onComplete(event: AutoCompleteCompleteEvent): void {
    this.complete.emit(event);
  }

  /** 드롭다운 항목 선택 이벤트 */
  protected onSelect(event: AutoCompleteSelectEvent): void {
    this.select.emit(event);
  }

  /** 드롭다운 항목 선택해제 이벤트 */
  protected onUnSelect(event: AutoCompleteUnselectEvent): void {
    this.unSelect.emit(event);
  }

  /** keyup 이벤트 */
  protected onKeyUp(event: KeyboardEvent): void {
    this.keyup.emit(event);
  }

}
