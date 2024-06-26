import { Component, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [
    RouterModule,
  ],
  selector: 'layout-site-title',
  templateUrl: './layout-site-title.component.html',
  styleUrl: './layout-site-title.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LayoutSiteTitleComponent {

}
