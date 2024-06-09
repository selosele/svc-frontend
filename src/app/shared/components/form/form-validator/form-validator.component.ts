import { Component } from '@angular/core';
import { AbstractControl, ValidationErrors, Validators } from '@angular/forms';

@Component({
  standalone: true,
  imports: [],
  selector: 'form-validator',
  templateUrl: './form-validator.component.html',
  styleUrl: './form-validator.component.scss'
})
export class FormValidator extends Validators {

  /** 숫자 값만 허용되도록 검증한다. */
  static numeric(control: AbstractControl): ValidationErrors | null {
    if (!control.value || !isNaN(control.value))
      return null;

    // 숫자가 아닌 경우 에러 반환
    return { 'numeric': true };
  }

}
