import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard {

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  canActivate() {
    // 로그인이 안 되어 있으면 로그인 페이지로 이동한다.
    if (!this.authService.isSignIned()) {
      this.router.navigate(['/sign-in']);
    }
  }

}
