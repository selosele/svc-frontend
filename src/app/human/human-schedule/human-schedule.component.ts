import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayoutPageDescriptionComponent } from '@app/shared/components/layout';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    LayoutPageDescriptionComponent,
  ],
  selector: 'view-human-schedule',
  templateUrl: './human-schedule.component.html',
  styleUrl: './human-schedule.component.scss'
})
export class HumanScheduleComponent {

}
