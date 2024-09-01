import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TooltipModule } from 'primeng/tooltip';
import { FormFieldComponent } from '../form-field/form-field.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextareaModule,
    TooltipModule,
  ],
  selector: 'ui-textarea',
  templateUrl: './ui-textarea.component.html',
  styleUrl: './ui-textarea.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UiTextareaComponent extends FormFieldComponent {

  override ngOnInit(): void {
    super.ngOnInit();
  }

}
