import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  standalone: true,
  imports: [],
  selector: 'ui-radio-group',
  templateUrl: './ui-radio-group.component.html',
  styleUrl: './ui-radio-group.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UiRadioGroupComponent {

  /** radio 그룹 label */
  @Input() label?: string;

}
