import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { FormFieldComponent } from '../form-field/form-field.component';
import { DropdownData } from './ui-dropdown.model';

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

  /** 리스트 팝업 위치 */
  @Input() appendTo = 'body';

  /** change 이벤트 */
  @Output() change? = new EventEmitter<DropdownChangeEvent>();

  /** blur 이벤트 */
  @Output() blur? = new EventEmitter<Event>();

  override ngOnInit() {
    super.ngOnInit();
  }

  /** change 이벤트 */
  protected onChange(event: DropdownChangeEvent): void {
    this.setErrorMessage();
    this.change.emit(event);
  }

  /** blur 이벤트 */
  protected onBlur(event: Event): void {
    this.setErrorMessage();
    this.blur.emit(event);
  }

}
