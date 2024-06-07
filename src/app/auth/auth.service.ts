import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isBlank } from '@app/shared/utils';
import { signInRequestDTO, signInResponseDTO } from './auth.dto';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(
    private http: HttpClient,
  ) {}

  /** 로그인을 한다. */
  signIn(signInRequestDTO: signInRequestDTO): Observable<signInResponseDTO> {
    return this.http.post<signInResponseDTO>('/auth/sign-in', signInRequestDTO);
  }

  /** 로그인 여부를 반환한다. */
  isSignIned(): boolean {

    /** 액세스 토큰 */
    const accessToken = window.localStorage.getItem('accessToken');
    if (isBlank(accessToken)) // TODO: 토큰 유효성 검증도 필요
      return false;

    return true;
  }

}
