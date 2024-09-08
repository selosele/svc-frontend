import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';
import { FormFieldComponent } from '../form-field/form-field.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CheckboxModule,
  ],
  selector: 'ui-checkbox',
  templateUrl: './ui-checkbox.component.html',
  styleUrl: './ui-checkbox.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UiCheckboxComponent extends FormFieldComponent {

  /** 체크박스 change 이벤트 */
  @Output() change? = new EventEmitter<CheckboxChangeEvent>();

  /** 체크박스 blur 이벤트 */
  @Output() blur? = new EventEmitter<Event>();

  override ngOnInit(): void {
    super.ngOnInit();
  }

  /** 체크박스 값을 변경한다. */
  onChange(event: CheckboxChangeEvent): void {
    this.setErrorMessage();
    this.change.emit(event);
  }

  /** 체크박스가 focus를 상실했을 때 발생한다. */
  onBlur(event: Event): void {
    this.setErrorMessage();
    this.blur.emit(event);
  }

}
