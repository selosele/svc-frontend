import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToggleButtonChangeEvent, ToggleButtonModule } from 'primeng/togglebutton';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToggleButtonModule,
  ],
  selector: 'ui-toggle-button',
  templateUrl: './ui-toggle-button.component.html',
  styleUrl: './ui-toggle-button.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UiToggleButtonComponent {

  /** 활성화 label */
  @Input() onLabel = 'On';

  /** 비활성화 label */
  @Input() offLabel = 'Off';

  /** 활성화 icon */
  @Input() onIcon = 'pi pi-check';

  /** 비활성화 icon */
  @Input() offIcon = 'pi pi-times';

  /** 체크 상태 */
  @Input() checked = false;

  /** change 이벤트 */
  @Output() change? = new EventEmitter<ToggleButtonChangeEvent>();

  /** change 이벤트 */
  protected onChange(event: ToggleButtonChangeEvent): void {
    this.change?.emit(event);
  }

}
