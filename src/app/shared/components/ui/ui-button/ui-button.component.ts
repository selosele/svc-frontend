import { Component, Input } from '@angular/core';
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

}
