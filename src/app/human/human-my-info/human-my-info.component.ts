import { Component, OnInit } from '@angular/core';
import { AuthenticatedUser } from '@app/auth/auth.model';
import { AuthService } from '@app/auth/auth.service';
import { HumanService } from '../human.service';

@Component({
  standalone: true,
  imports: [],
  selector: 'modal-human-my-info',
  templateUrl: './human-my-info.component.html',
  styleUrl: './human-my-info.component.scss'
})
export class HumanMyInfoComponent implements OnInit {
  
  /** 인증된 사용자 정보 */
  user: AuthenticatedUser;

  constructor(
    private authService: AuthService,
    private humanService: HumanService,
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getAuthenticatedUser();
    this.getUser();
  }

  /** 직원을 조회한다. */
  private getUser(): void {
    this.humanService.getEmployee(this.user.employeeId)
    .subscribe(data => {
      console.log(data);
    });
  }

}
