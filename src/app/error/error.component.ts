import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { UiButtonComponent } from '@app/shared/components/ui';
import { StoreService } from '@app/shared/services';

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
    private store: StoreService,
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.store.update<string>('currentPageTitle', null);
      });
  }

  /** 메인 페이지로 이동한다. */
  goMainPage(): void {
    this.router.navigateByUrl('/index');
  }

  /** 이전 페이지로 이동한다. */
  goBackPage(): void {
    this.location.back();
  }

}
