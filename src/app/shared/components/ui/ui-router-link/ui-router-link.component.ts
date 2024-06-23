import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Params, RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [
    RouterModule,
  ],
  selector: 'ui-router-link',
  templateUrl: './ui-router-link.component.html',
  styleUrl: './ui-router-link.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UiRouterLinkComponent {

  /** router link */
  @Input() routerLink?: string;

  /** router queryParams */
  @Input() queryParams?: Params | null;

}
