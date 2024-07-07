import { Component } from '@angular/core';
import { LayoutPageDescriptionComponent } from '@app/shared/components';

@Component({
  standalone: true,
  imports: [
    LayoutPageDescriptionComponent,
  ],
  selector: 'view-schedule',
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss'
})
export class ScheduleComponent {

}
