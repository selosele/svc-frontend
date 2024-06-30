import { Component, ViewEncapsulation } from '@angular/core';
import { ToastModule } from 'primeng/toast';

@Component({
  standalone: true,
  imports: [
    ToastModule,
  ],
  selector: 'ui-message',
  templateUrl: './ui-message.component.html',
  styleUrl: './ui-message.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UiMessageComponent {

  

}
