import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { LayoutHeaderComponent, UiLoadingComponent, UiMessageComponent } from './shared/components';

@Component({
  standalone: true,
  imports: [
    RouterOutlet,
    UiLoadingComponent,
    UiMessageComponent,
    LayoutHeaderComponent,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor(
    protected authService: AuthService,
  ) {}
  
}
