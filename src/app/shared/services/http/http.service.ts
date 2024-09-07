import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { isObjectEmpty } from '@app/shared/utils';

@Injectable({ providedIn: 'root' })
export class HttpService {

  /** 파라미터를 생성해서 반환한다. */
  createParams(data: any): HttpParams {
    if (isObjectEmpty(data)) return null;

    let params = new HttpParams();
    Object.keys(data).forEach(key => {
      params = params.append(key, data[key]);
    });
    return params;
  }

}
