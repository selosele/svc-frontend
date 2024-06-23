import { Component, ViewEncapsulation } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { isBlank, isEmpty } from '@app/shared/utils';

@Component({
  standalone: true,
  imports: [],
  selector: 'form-validator',
  templateUrl: './form-validator.component.html',
  styleUrl: './form-validator.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class FormValidator extends Validators {

  /** 숫자 값인지 검증한다. */
  static numeric(control: AbstractControl): ValidationErrors | null {
    if (!control.value || !isNaN(control.value))
      return null;

    // 숫자가 아닌 경우 에러 반환
    return { 'numeric': true };
  }

  /** 최소에서 최대 사이의 숫자 값을 입력하였는지 검증한다. */
  static between(start: number, end: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (isEmpty(value) || isNaN(value))
        return { 'between': { valid: false, start, end } };

      // 값이 start와 end 사이에 있는 경우 유효함
      if (value >= start && value <= end)
        return null;

      // 값이 범위에 있지 않은 경우 에러 반환
      return { 'between': { valid: false, start, end } };
    }
  }

  /** 최소 길이에서 최대 길이 사이의 문자열 값을 입력하였는지 검증한다. */
  static betweenLength(start: number, end: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string;

      if (isBlank(value))
        return { 'betweenLength': { valid: false, start, end } };

      // 값이 start와 end 사이에 있는 경우 유효함
      if (value.length >= start && value.length <= end)
        return null;

      // 값이 범위에 있지 않은 경우 에러 반환
      return { 'betweenLength': { valid: false, start, end } };
    }
  }

}
