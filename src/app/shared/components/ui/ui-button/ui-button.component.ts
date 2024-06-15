import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { BlockButtonDirective } from '@app/shared/directives';

@Component({
  standalone: true,
  imports: [
    ButtonModule,
    BlockButtonDirective,
  ],
  selector: 'ui-button',
  templateUrl: './ui-button.component.html',
  styleUrl: './ui-button.component.scss'
})
export class UiButtonComponent {

  /** 버튼 type */
  @Input() type? = 'button';

  /** block 스타일 버튼 여부 */
  @Input() block?: boolean;

  /** 버튼 disabled */
  @Input() disabled?: boolean;

  /** 버튼 클릭 이벤트 */
  @Output() click? = new EventEmitter<Event>();

  /** 버튼을 클릭한다. */
  onClick(event: Event): void {
    this.click.emit(event);
  }

}
