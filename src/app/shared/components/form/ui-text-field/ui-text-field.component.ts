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

  /** input keydown 이벤트 */
  @Output() keydown? = new EventEmitter<KeyboardEvent>();

  /** input blur 이벤트 */
  @Output() blur? = new EventEmitter<FocusEvent>();

  override ngOnInit() {
    super.ngOnInit();
  }

  /** input keydown 이벤트 */
  onKeydown(event: KeyboardEvent) {
    this.setErrorMessage();
    this.keydown.emit(event);
  }

  /** input blur 이벤트 */
  onBlur(event: FocusEvent) {
    this.setErrorMessage();
    this.blur.emit(event);
  }

}
