import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { FormFieldComponent } from '../form-field/form-field.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CheckboxModule,
  ],
  selector: 'ui-checkbox',
  templateUrl: './ui-checkbox.component.html',
  styleUrl: './ui-checkbox.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UiCheckboxComponent extends FormFieldComponent {

  override ngOnInit(): void {
    super.ngOnInit();
  }

}
