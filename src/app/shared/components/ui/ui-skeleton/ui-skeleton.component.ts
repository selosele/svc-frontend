import { Component, ViewEncapsulation } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  standalone: true,
  imports: [
    SkeletonModule,
  ],
  selector: 'ui-skeleton',
  templateUrl: './ui-skeleton.component.html',
  styleUrl: './ui-skeleton.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UiSkeletonComponent {



}
