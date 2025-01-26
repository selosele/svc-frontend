import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/auth/auth.service';
import { HumanService } from '@app/human/human.service';

@Component({
  standalone: true,
  imports: [

  ],
  selector: 'view-index',
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private humanService: HumanService,
  ) {}

  /** 인증된 사용자 정보 */
  get user() {
    return this.authService.getAuthenticatedUser();
  }

  ngOnInit() {
    this.humanService.listVacationStats$({ userId: this.user?.userId })
    .subscribe((data) => {

    });
  }

}
