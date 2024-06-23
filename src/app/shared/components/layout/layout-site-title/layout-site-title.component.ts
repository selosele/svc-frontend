import { Component, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UiRouterLinkComponent } from '../../ui';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    UiRouterLinkComponent,
  ],
  selector: 'layout-site-title',
  templateUrl: './layout-site-title.component.html',
  styleUrl: './layout-site-title.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LayoutSiteTitleComponent {

}
