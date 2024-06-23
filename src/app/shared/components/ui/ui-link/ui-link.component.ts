import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

@Component({
  standalone: true,
  imports: [],
  selector: 'ui-link',
  templateUrl: './ui-link.component.html',
  styleUrl: './ui-link.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UiLinkComponent {

  /** 링크 href */
  @Input() href?: string;

  /** 링크 클릭 이벤트 */
  @Output() click? = new EventEmitter<Event>();

  /** 링크를 클릭한다. */
  onClick(event: Event): void {
    this.click.emit(event);
  }

}
