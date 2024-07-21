import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
  ],
  selector: 'ui-form',
  templateUrl: './ui-form.component.html',
  styleUrl: './ui-form.component.scss'
})
export class UiFormComponent {

  /** form */
  @Input() form: FormGroup;

  /** form 데이터 전송 이벤트 */
  @Output() submit = new EventEmitter<any>();

  /** form 데이터를 전송한다. */
  protected onSubmit(event: Event): void {
    event.stopPropagation();
    
    if (!this.form.valid) {
      this.validateAllFormFields(this.form);
      return;
    }
    this.submit.emit(this.form.value);
  }

  /** form 필드 유효성 검증을 한다. */
  private validateAllFormFields(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);

      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      }
      else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

}
