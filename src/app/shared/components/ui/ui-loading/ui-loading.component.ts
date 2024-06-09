import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { UiLoadingService } from '@app/shared/services';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ProgressSpinnerModule,
  ],
  selector: 'ui-loading',
  templateUrl: './ui-loading.component.html',
  styleUrl: './ui-loading.component.scss'
})
export class UiLoadingComponent {

  constructor(
    private loadingService: UiLoadingService,
  ) {}

  /** 로딩 상태 */
  loading$ = this.loadingService.loading$;

  /** 취소 버튼을 클릭해서 로딩을 종료한다. */
  handleClick() {
    this.loadingService.stopLoading();
  }

  /** Esc 키를 클릭해서 로딩을 종료한다. */
  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: KeyboardEvent) {
    this.loadingService.stopLoading();
  }

}
