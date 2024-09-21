import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { StoreService } from '@app/shared/services';
import { MenuService } from '@app/menu/menu.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  selector: 'layout-breadcrumb',
  templateUrl: './layout-breadcrumb.component.html',
  styleUrl: './layout-breadcrumb.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LayoutBreadcrumbComponent implements OnInit {

  constructor(
    private store: StoreService,
    private menuService: MenuService,
  ) {}

  /** breadcrumb 목록 */
  get items() {
    return this.store.select<MenuItem[]>('breadcrumbList').value;
  }

  ngOnInit() {
    this.menuService.setBreadcrumb();
  }

}
