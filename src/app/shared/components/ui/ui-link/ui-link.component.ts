import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [
    RouterModule,
  ],
  selector: 'ui-link',
  templateUrl: './ui-link.component.html',
  styleUrl: './ui-link.component.scss'
})
export class UiLinkComponent {

  /** router link */
  @Input() routerLink?: string;

}
