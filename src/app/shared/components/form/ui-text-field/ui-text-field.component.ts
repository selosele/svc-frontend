import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { FormFieldComponent } from '../form-field/form-field.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    TooltipModule,
  ],
  selector: 'ui-text-field',
  templateUrl: './ui-text-field.component.html',
  styleUrl: './ui-text-field.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UiTextFieldComponent extends FormFieldComponent {

  /** input type */
  @Input() type? = 'text';

  /** keyup 이벤트 */
  @Output() keyup? = new EventEmitter<KeyboardEvent>();

  /** blur 이벤트 */
  @Output() blur? = new EventEmitter<FocusEvent>();

  /** input 이벤트 */
  @Output() input? = new EventEmitter<Event>();

  override ngOnInit() {
    super.ngOnInit();
  }

  /** keyup 이벤트 */
  protected onKeyup(event: KeyboardEvent): void {
    this.setErrorMessage();
    this.keyup.emit(event);
  }

  /** blur 이벤트 */
  protected onBlur(event: FocusEvent): void {
    this.setErrorMessage();
    this.blur.emit(event);
  }

  /** input 이벤트 */
  protected onInput(event: Event): void {
    this.setErrorMessage();
    this.input.emit(event);
  }

}
