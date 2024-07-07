import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { FormFieldComponent } from '../form-field/form-field.component';
import { DropdownData } from '@app/shared/models';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DropdownModule,
  ],
  selector: 'ui-dropdown',
  templateUrl: './ui-dropdown.component.html',
  styleUrl: './ui-dropdown.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UiDropdownComponent extends FormFieldComponent {

  /** 드롭다운 데이터 */
  @Input() data?: DropdownData[];

  override ngOnInit(): void {
    super.ngOnInit();
  }

}
