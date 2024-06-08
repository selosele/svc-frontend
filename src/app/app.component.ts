import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UiLoadingComponent } from './shared/components/ui/ui-loading/ui-loading.component';
import { UiMessageComponent } from './shared/components/ui/ui-message/ui-message.component';

@Component({
  standalone: true,
  imports: [
    RouterOutlet,
    UiLoadingComponent,
    UiMessageComponent,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  
  
}
