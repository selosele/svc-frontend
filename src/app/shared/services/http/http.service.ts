import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { isObjectEmpty } from '@app/shared/utils';

@Injectable({ providedIn: 'root' })
export class HttpService {

  /** 파라미터를 생성해서 반환한다. */
  createParams(data: any): HttpParams {
    if (isObjectEmpty(data)) return null;

    let params = new HttpParams();
    
    for (const key of Object.keys(data)) {
      if (data[key]) {
        if (data[key] instanceof Array) {
          data[key].forEach((i) => {
            params = params.append(key.toString(), i);
          });
        } else {
          params = params.append(key.toString(), data[key]);
        }
      }
    }
    return params;
  }

}
