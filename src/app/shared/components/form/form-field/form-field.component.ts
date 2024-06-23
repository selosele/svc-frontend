import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
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
    const formGroup = this.control.parent.controls;
    this.name = Object.keys(formGroup).find(name => this.control === formGroup[name]) || null;
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
