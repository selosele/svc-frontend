import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { FormFieldComponent } from '../form-field/form-field.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    TooltipModule,
  ],
  selector: 'ui-text-field',
  templateUrl: './ui-text-field.component.html',
  styleUrl: './ui-text-field.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UiTextFieldComponent extends FormFieldComponent {

  /** input type */
  @Input() type? = 'text';

  override ngOnInit() {
    super.ngOnInit();
  }

}
