import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UiLinkComponent } from '../../ui';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    UiLinkComponent,
  ],
  selector: 'layout-site-title',
  templateUrl: './layout-site-title.component.html',
  styleUrl: './layout-site-title.component.scss'
})
export class LayoutSiteTitleComponent {

}
