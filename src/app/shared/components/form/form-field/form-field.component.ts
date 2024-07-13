import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { isEmpty, validationMessage } from '@app/shared/utils';

@Component({
  standalone: true,
  imports: [],
  selector: 'form-field',
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class FormFieldComponent implements OnInit {

  /** form 컨트롤 */
  @Input() control: AbstractControl<any, any>;

  /** form 컨트롤 */
  formControl: FormControl<any>;

  /** block 스타일 input 여부 */
  @Input() block?: boolean;

  /** input readonly */
  @Input() readonly? = false;

  /** input label */
  @Input() label?: string;

  /** input placeholder */
  @Input() placeholder?: string;

  /** input value */
  @Input() value?: any;

  /** input name */
  name?: string;

  /** input 오류 메시지 */
  errorMessage: string;

  ngOnInit(): void {
    this.formControl = this.control as FormControl<any>;
    this.setName();
  }

  /** input name 값을 설정한다. */
  setName(): void {
    if (this.control) {
      this.name = this.findControlName(this.control);
    }
  }

  /** 재귀 함수로 FormControl의 이름을 찾아서 반환한다.  */
  findControlName(control: AbstractControl): string | null {
    let parent = control.parent;
    if (!parent) {
      return null;
    }

    const formGroup = parent.controls;

    for (const name in formGroup) {
      if (formGroup[name] === control) {
        return name;
      } else if (formGroup[name] instanceof FormGroup) {
        const nestedControlName = this.findControlName(control);
        if (nestedControlName) {
          return `${name}.${nestedControlName}`;
        }
      }
    }
    return null;
  }

  /** 오류 메시지를 설정한다. */
  setErrorMessage(): void {
    const errors = this.control.errors;
    
    if (isEmpty(errors)) {
      this.errorMessage = '';
      return;
    }

    Object.keys(errors).forEach(key => {
      switch (key) {
        case 'required':      this.errorMessage = validationMessage.required(); break;
        case 'min':           this.errorMessage = validationMessage.min(errors[key].min); break;
        case 'max':           this.errorMessage = validationMessage.max(errors[key].max); break;
        case 'minlength':     this.errorMessage = validationMessage.minLength(errors[key].requiredLength); break;
        case 'maxlength':     this.errorMessage = validationMessage.maxlength(errors[key].requiredLength); break;
        case 'numeric':       this.errorMessage = validationMessage.numeric(); break;
        case 'between':       this.errorMessage = validationMessage.between(errors[key].start, errors[key].end); break;
        case 'betweenLength': this.errorMessage = validationMessage.betweenLength(errors[key].start, errors[key].end); break;
        default :             this.errorMessage = ''; break;
      }
    });
  }

}
