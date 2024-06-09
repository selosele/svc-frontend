import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UiLinkComponent } from '../../ui';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    UiLinkComponent,
  ],
  selector: 'layout-page-title',
  templateUrl: './layout-page-title.component.html',
  styleUrl: './layout-page-title.component.scss'
})
export class LayoutPageTitleComponent {

}
