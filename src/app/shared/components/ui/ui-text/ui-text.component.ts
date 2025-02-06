import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    InputTextModule,
  ],
  selector: 'ui-text',
  templateUrl: './ui-text.component.html',
  styleUrl: './ui-text.component.scss'
})
export class UiTextComponent {

  /** block 스타일 input 여부 */
  @Input() block?: boolean;

  /** input label */
  @Input() label?: string;

  /** input type */
  @Input() type? = 'text';

  /** input name */
  @Input() name?: string;

  /** input value */
  @Input() value?: any;

  /** input placeholder */
  @Input() placeholder?: string = '';

  /** input readonly */
  @Input() readonly? = false;

  /** input value 변경 이벤트 */
  @Output() input = new EventEmitter<Event>();

  /** input value가 변경된다. */
  protected onInput(event: Event): void {
    this.input.emit(event);
  }

}
