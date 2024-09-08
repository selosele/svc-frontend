import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  standalone: true,
  imports: [
    CommonModule,
  ],
  selector: 'ui-flex-box',
  templateUrl: './ui-flex-box.component.html',
  styleUrl: './ui-flex-box.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UiFlexBoxComponent {

  /** flex gap */
  @Input() gap?: string;

  /** flex justify-content */
  @Input() justifyContent = 'start';

  /** flex align-items */
  @Input() alignItems = 'stretch';

}
