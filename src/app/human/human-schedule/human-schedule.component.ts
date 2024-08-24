import { Component } from '@angular/core';
import { LayoutPageDescriptionComponent } from '@app/shared/components/layout';

@Component({
  standalone: true,
  imports: [
    LayoutPageDescriptionComponent,
  ],
  selector: 'view-human-schedule',
  templateUrl: './human-schedule.component.html',
  styleUrl: './human-schedule.component.scss'
})
export class HumanScheduleComponent {

}
