import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { UiLoadingService } from './shared/services/ui/ui-loading-service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ToastModule,
    ProgressSpinnerModule,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor(
    private loadingService: UiLoadingService
  ) {}

  /** 로딩 상태 */
  loading$ = this.loadingService.loading$;
  
}
