import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { UiButtonComponent } from '@app/shared/components/ui';
import { MAIN_PAGE_PATH2 } from '@app/shared/utils';

@Component({
  standalone: true,
  imports: [
    UiButtonComponent,
  ],
  selector: 'view-error',
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss'
})
export class ErrorComponent {

  constructor(
    private router: Router,
    private location: Location,
  ) {}

  /** 메인 페이지로 이동한다. */
  goMainPage(): void {
    this.router.navigateByUrl(MAIN_PAGE_PATH2);
  }

  /** 이전 페이지로 이동한다. */
  goBackPage(): void {
    this.location.back();
  }

}
