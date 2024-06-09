import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UiLoadingComponent, UiMessageComponent } from './shared/components';

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
