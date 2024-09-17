import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormFieldComponent } from '../form-field/form-field.component';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
  ],
  selector: 'ui-hidden-field',
  templateUrl: './ui-hidden-field.component.html',
  styleUrl: './ui-hidden-field.component.scss',
})
export class UiHiddenFieldComponent extends FormFieldComponent {

  override ngOnInit() {
    super.ngOnInit();
  }

}
