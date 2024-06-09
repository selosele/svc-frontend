import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FormFieldComponent } from '../form-field/form-field.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
  ],
  selector: 'ui-text-field',
  templateUrl: './ui-text-field.component.html',
  styleUrl: './ui-text-field.component.scss'
})
export class UiTextFieldComponent extends FormFieldComponent {

  /** input type */
  @Input() type? = 'text';

  /** input placeholder */
  @Input() placeholder?: string;

}
