import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RadioButtonClickEvent, RadioButtonModule } from 'primeng/radiobutton';
import { FormFieldComponent } from '../form-field/form-field.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RadioButtonModule,
  ],
  selector: 'ui-radio',
  templateUrl: './ui-radio.component.html',
  styleUrl: './ui-radio.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UiRadioComponent extends FormFieldComponent {

  /** click 이벤트 */
  @Output() click? = new EventEmitter<RadioButtonClickEvent>();

  /** blur 이벤트 */
  @Output() blur? = new EventEmitter<Event>();

  override ngOnInit() {
    super.ngOnInit();
  }

  /** click 이벤트 */
  protected onClick(event: RadioButtonClickEvent): void {
    this.setErrorMessage();
    this.click.emit(event);
  }

  /** blur 이벤트 */
  protected onBlur(event: Event): void {
    this.setErrorMessage();
    this.blur.emit(event);
  }

}
