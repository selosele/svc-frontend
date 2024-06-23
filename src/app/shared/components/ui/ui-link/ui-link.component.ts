import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { Params, RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [
    RouterModule,
  ],
  selector: 'ui-link',
  templateUrl: './ui-link.component.html',
  styleUrl: './ui-link.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UiLinkComponent {

  /** router link */
  @Input() routerLink?: string;

  /** router queryParams */
  @Input() queryParams?: Params | null;

  /** 버튼 클릭 이벤트 */
  @Output() click? = new EventEmitter<Event>();

  /** 버튼을 클릭한다. */
  onClick(event: Event): void {
    this.click.emit(event);
  }

}
