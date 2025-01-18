import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UiButtonComponent } from '../../ui';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    UiButtonComponent,
  ],
  selector: 'ui-form',
  templateUrl: './ui-form.component.html',
  styleUrl: './ui-form.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UiFormComponent {

  /** form */
  @Input() form: FormGroup;

  /** Enter키를 통한 submit 이벤트 발생 여부 */
  @Input() enterKeySubmit = true;

  /** 저장 버튼 사용 여부 */
  @Input() useSubmit = true;

  /** 삭제 버튼 사용 여부 */
  @Input() useRemove = false;

  /** form submit 이벤트 */
  @Output() submit = new EventEmitter<any>();

  /** 삭제 버튼 클릭 이벤트 */
  @Output() remove = new EventEmitter<Event>();

  /** form을 submit한다. */
  protected onSubmit(event: Event): void {
    event.stopPropagation();
    event.preventDefault(); // submit시, 이벤트 2번 발생 문제로 인해 추가
    
    if (!this.form.valid) {
      this.validateAllFormFields(this.form);
      return;
    }
    this.submit.emit(this.form.value);
  }

  /** 삭제 버튼을 클릭한다. */
  protected onRemove(event: Event): void {
    this.remove.emit(event);
  }

  /** Enter키를 통한 submit 이벤트를 방지한다. */
  protected onEnterKey(event: Event): void {
    if (this.enterKeySubmit) return;
    event.preventDefault();
  }

  /** form 필드 유효성 검증을 한다. */
  private validateAllFormFields(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((field) => {
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
