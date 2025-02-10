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

  /** change 이벤트 */
  @Output() change? = new EventEmitter<CheckboxChangeEvent>();

  /** blur 이벤트 */
  @Output() blur? = new EventEmitter<Event>();

  override ngOnInit() {
    super.ngOnInit();
  }

  /** change 이벤트 */
  protected onChange(event: CheckboxChangeEvent): void {
    this.setErrorMessage();
    this.change.emit(event);
  }

  /** blur 이벤트 */
  protected onBlur(event: Event): void {
    this.setErrorMessage();
    this.blur.emit(event);
  }

}
