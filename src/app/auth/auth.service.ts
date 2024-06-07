import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isNotBlank } from '@app/shared/utils';
import { SignInRequestDTO, SignInResponseDTO } from './auth.dto';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(
    private http: HttpClient,
  ) {}

  /** 로그인을 한다. */
  signIn(signInRequestDTO: SignInRequestDTO): void {
    this.http.post<SignInResponseDTO>('/auth/sign-in', signInRequestDTO)
    .subscribe({
      next: (data) => {
        const accessToken = data.accessToken;
        if (isNotBlank(accessToken)) {
          window.localStorage.setItem('accessToken', accessToken);
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  /** 로그인 여부를 반환한다. */
  isSignIned(): boolean {

    /** 액세스 토큰 */
    const accessToken = window.localStorage.getItem('accessToken');
    if (isNotBlank(accessToken)) // TODO: 토큰 유효성 검증도 필요
      return true;

    return false;
  }

}
