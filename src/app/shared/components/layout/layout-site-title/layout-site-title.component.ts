import { Component, ElementRef, HostListener, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { UiMessageService } from '@app/shared/services';
import { UserStore } from '@app/user/user.store';
import { UserService } from '@app/user/user.service';
import { MAIN_PAGE_PATH1 } from '@app/shared/utils';
import { UiButtonComponent } from '../../ui';
import { CoreBaseComponent } from '../../core';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    UiButtonComponent,
  ],
  selector: 'layout-site-title',
  templateUrl: './layout-site-title.component.html',
  styleUrl: './layout-site-title.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LayoutSiteTitleComponent extends CoreBaseComponent implements OnInit {

  constructor(
    private eRef: ElementRef,
    private router: Router,
    private userStore: UserStore,
    private messageService: UiMessageService,
    private userService: UserService,
  ) {
    super();
  }

  /** 사이트타이틀명 */
  @Input() name: string;

  /** 사이트타이틀명 편집필드 */
  @ViewChild('editName') editName: ElementRef;

  /** 사이트타이틀 링크 */
  link = MAIN_PAGE_PATH1;

  /** 사이트타이틀명 편집 상태 */
  isEditVisible = false;

  /** 사이트타이틀명 편집 상태 */
  isEditable = false;

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.onEditVisibleDeActivate();
      });
  }

  /** 편집버튼을 활성화한다. */
  onEditVisibleActivate(): void {
    this.isEditVisible = true;
  }

  /** 편집버튼을 비활성화한다. */
  onEditVisibleDeActivate(): void {
    if (this.isEditable) return;

    this.isEditVisible = false;
    this.isEditable = false;
  }

  /** 사이트타이틀명 편집 버튼을 클릭한다. */
  onEdit(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.isEditable) {
      this.onSubmit(event);
    } else {
      this.isEditable = true;
    }
  }

  /** 사이트타이틀명을 편집한다. */
  onKeyup(): void {
    const siteTitleName = this.editName.nativeElement.value as string;
    document.title = siteTitleName;
  }

  /** 사이트타이틀명을 저장한다. */
  onSubmit(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    const userId = this.user?.userId;
    const siteTitleName = this.editName.nativeElement.value as string;

    if (!siteTitleName.trim()) {
      return;
    }

    if (siteTitleName.trim().length > 20) {
      this.messageService.toastInfo('20자 이내로 입력해주세요.');
      return;
    }
    
    this.userService.addUserSetup$({ userId, siteTitleName })
    .subscribe((response) => {
      this.userStore.update('userSetup', response.userSetup);
      this.messageService.toastSuccess('저장되었어요.');
    });
  }

  /** 편집필드 바깥 화면을 클릭해서 편집필드를 닫는다. */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    // 클릭된 요소가 편집필드 내부에 있는지 확인
    if (this.isEditVisible && !this.eRef.nativeElement.contains(event.target)) {
      this.isEditVisible = false;
      this.isEditable = false;
      document.title = this.name;
    }
  }

  /** Esc 키를 클릭해서 편집필드를 닫는다. */
  @HostListener('document:keyup.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent): void {
    if (this.isEditVisible) {
      this.isEditVisible = false;
      this.isEditable = false;
      document.title = this.name;
    }
  }

}
