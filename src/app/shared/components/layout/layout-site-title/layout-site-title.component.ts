import { AfterViewChecked, Component, ElementRef, HostListener, Input, NgZone, ViewChild, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
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
export class LayoutSiteTitleComponent extends CoreBaseComponent implements AfterViewChecked {

  constructor(
    private zone: NgZone,
    private eRef: ElementRef,
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

  ngAfterViewChecked() {
    this.zone.runOutsideAngular(() => {
      if (this.isEditable && this.editName) {
        setTimeout(() => {
          this.editName.nativeElement.focus();
        });
      }
    });
  }

  /** 편집버튼을 활성화한다. */
  onMouseEnter(): void {
    this.isEditVisible = true;
  }

  /** 편집버튼을 비활성화한다. */
  onMouseLeave(): void {
    if (this.isEditable) return;

    this.isEditVisible = false;
    this.isEditable = false;
  }

  /** 사이트타이틀명을 편집한다. */
  onEdit(event: Event): void {
    event.stopPropagation();

    if (this.isEditable) {
      this.onSubmit();
    } else {
      this.isEditable = true;
    }
  }

  /** 사이트타이틀명을 저장한다. */
  onSubmit(): void {
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
    .subscribe((data) => {
      this.userStore.update('userSetup', data);
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
    }
  }

}
