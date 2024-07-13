import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  standalone: true,
  imports: [],
  selector: 'ui-checkbox-group',
  templateUrl: './ui-checkbox-group.component.html',
  styleUrl: './ui-checkbox-group.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UiCheckboxGroupComponent {

  /** checkbox 그룹 label */
  @Input() label?: string;

}
