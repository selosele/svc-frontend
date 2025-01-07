import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  standalone: true,
  imports: [
    ButtonModule,
  ],
  selector: 'ui-button',
  templateUrl: './ui-button.component.html',
  styleUrl: './ui-button.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UiButtonComponent {

  /** 버튼 크기 */
  @Input() size?: 'small' | 'large';

  /** 버튼 severity */
  @Input() severity?: 'success' | 'info' | 'warning' | 'danger' | 'help' | 'primary' | 'secondary' | 'contrast';

  /** 버튼 외곽선 표출여부 */
  @Input() outlined?: boolean;

  /** 버튼 아이콘 */
  @Input() icon?: string;

  /** 버튼 label */
  @Input() label?: string;

  /** 버튼 text */
  @Input() text?: boolean;

  /** 버튼 type */
  @Input() type? = 'button';

  /** block 스타일 버튼 여부 */
  @Input() block?: boolean;

  /** 버튼 disabled */
  @Input() disabled?: boolean;

  /** 버튼 클릭 이벤트 */
  @Output() click? = new EventEmitter<Event>();

  /** 버튼을 클릭한다. */
  protected onClick(event: Event): void {
    event.stopPropagation();
    this.click.emit(event);
  }

}
