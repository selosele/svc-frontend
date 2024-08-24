import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  standalone: true,
  imports: [
    CardModule,
  ],
  selector: 'ui-card',
  templateUrl: './ui-card.component.html',
  styleUrl: './ui-card.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UiCardComponent {

  /** 제목 */
  @Input() header?: string;

}
