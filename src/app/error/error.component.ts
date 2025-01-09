import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { UiButtonComponent } from '@app/shared/components/ui';

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
    this.router.navigateByUrl('/index');
  }

  /** 이전 페이지로 이동한다. */
  goBackPage(): void {
    this.location.back();
  }

}
