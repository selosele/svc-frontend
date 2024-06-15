import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { isNotBlank } from '@app/shared/utils';
import { LoginRequestDTO, LoginResponseDTO } from './auth.dto';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  /** 로그인을 한다. */
  login(loginRequestDTO: LoginRequestDTO): void {
    this.http.post<LoginResponseDTO>('/auth/login', loginRequestDTO)
    .subscribe({
      next: (data) => {
        const accessToken = data.accessToken;
        if (isNotBlank(accessToken)) {
          window.localStorage.setItem('accessToken', accessToken);
          this.router.navigateByUrl('/');
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  /** 로그아웃을 한다. */
  logout(): void {
    this.http.post<void>('/auth/logout', {})
    .subscribe({
      next: () => {
        window.localStorage.removeItem('accessToken');
        this.router.navigateByUrl('/auth/login');
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  /** 로그인 여부를 반환한다. */
  isLogined(): boolean {
    const accessToken = window.localStorage.getItem('accessToken');
    if (isNotBlank(accessToken)) // TODO: 토큰 유효성 검증도 필요
      return true;

    return false;
  }

}
