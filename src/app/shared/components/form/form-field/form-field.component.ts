import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { isObjectEmpty, validationMessage } from '@app/shared/utils';

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

  /** form 컨트롤 */
  foundControl: any = null;

  /** block 스타일 input 여부 */
  @Input() block?: boolean;

  /** 툴팁 텍스트 */
  @Input() tooltip?: string;

  /** 툴팁 텍스트 위치 */
  @Input() tooltipPosition?: 'top' | 'left' | 'right' | 'bottom';

  /** input readonly */
  @Input() readonly? = false;

  /** input label */
  @Input() label?: string;

  /** input placeholder */
  @Input() placeholder?: string = '';

  /** input align */
  @Input() align?: string;

  /** input value */
  @Input() value?: any = '';

  /** input 오류 메시지 표출 여부 */
  @Input() showErrorMessage = true;

  /** input 오류 메시지 */
  errorMessage: string;

  /** input name */
  name?: string;

  ngOnInit() {
    if (isObjectEmpty(this.foundControl)) {
      this.foundControl = this.findControl(this.control);
      this.formControl = this.foundControl?.control;
      this.name = this.foundControl?.name;
    }

    if (this.showErrorMessage) {
      this.setErrorMessage();
    }
  }

  /** 오류 메시지를 설정한다. */
  protected setErrorMessage(): void {
    if (isObjectEmpty(this.control)) return;
    
    const { errors } = this.control;
    
    if (isObjectEmpty(errors)) {
      this.errorMessage = '';
      return;
    }

    Object.keys(errors).forEach((key) => {
      switch (key) {
        case 'required':      this.errorMessage = validationMessage.required(); break;
        case 'min':           this.errorMessage = validationMessage.min(errors[key].min); break;
        case 'max':           this.errorMessage = validationMessage.max(errors[key].max); break;
        case 'minlength':     this.errorMessage = validationMessage.minLength(errors[key].requiredLength); break;
        case 'maxlength':     this.errorMessage = validationMessage.maxlength(errors[key].requiredLength); break;
        case 'numeric':       this.errorMessage = validationMessage.numeric(); break;
        case 'between':       this.errorMessage = validationMessage.between(errors[key].start, errors[key].end); break;
        case 'betweenLength': this.errorMessage = validationMessage.betweenLength(errors[key].start, errors[key].end); break;
        case 'email':         this.errorMessage = validationMessage.email(); break;
        default :             this.errorMessage = ''; break;
      }
    });
  }

  /** 재귀 함수로 FormControl을 찾아서 반환한다. */
  private findControl(control: AbstractControl) {
    const parent = control?.parent;
    if (!parent) return null;

    const formGroup = parent.controls;

    for (const name in formGroup) {
      if (formGroup[name] === control) {
        return { control: formGroup[name], name };
      }
      else if (formGroup[name] instanceof FormGroup) {
        const nestedControl = this.findControl(control);
        if (nestedControl) {
          return { control: nestedControl.control, name: `${name}.${nestedControl.name}` };
        }
      }
    }
    return null;
  }

}
