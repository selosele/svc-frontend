import { Injectable } from '@angular/core';
import { StoreService } from '@app/shared/services';

@Injectable({ providedIn: 'root' })
export class LayoutMobileMenuStore extends StoreService {

  constructor() {
    super();
  }

  override init() {
    this.creates([
      { key: 'isVisible', defaultValue: false }, // 모바일 메뉴 표출 여부
    ]);
  }

}