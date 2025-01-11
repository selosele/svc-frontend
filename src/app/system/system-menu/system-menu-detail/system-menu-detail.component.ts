import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormValidator, UiCheckboxComponent, UiCheckboxGroupComponent, UiCheckboxListComponent, UiDropdownComponent, UiHiddenFieldComponent, UiSplitFormComponent, UiTextFieldComponent } from '@app/shared/components/form';
import { UiCardComponent, UiContentTitleComponent } from '@app/shared/components/ui';
import { isEmpty, isObjectEmpty, roles } from '@app/shared/utils';
import { StoreService, UiMessageService } from '@app/shared/services';
import { CodeService } from '@app/code/code.service';
import { MenuService } from '@app/menu/menu.service';
import { MenuResponseDTO, SaveMenuRequestDTO } from '@app/menu/menu.model';
import { RoleResponseDTO } from '@app/role/role.model';
import { TransformToDto } from '@app/shared/decorators';

@Component({
  standalone: true,
  imports: [
    UiSplitFormComponent,
    UiTextFieldComponent,
    UiHiddenFieldComponent,
    UiDropdownComponent,
    UiCheckboxGroupComponent,
    UiCheckboxListComponent,
    UiCheckboxComponent,
    UiContentTitleComponent,
    UiCardComponent,
  ],
  selector: 'system-menu-detail',
  templateUrl: './system-menu-detail.component.html',
  styleUrl: './system-menu-detail.component.scss'
})
export class SystemMenuDetailComponent {

  constructor(
    private fb: FormBuilder,
    private store: StoreService,
    private messageService: UiMessageService,
    private codeService: CodeService,
    private menuService: MenuService,
  ) {}

  /** 메뉴 정보 */
  @Input() detail: MenuResponseDTO = null;

  /** 메뉴 상세 조회 폼 */
  detailForm: FormGroup;

  /** Y/N 데이터 목록 */
  ynCodes = this.codeService.createYnCodeData();

  /** 모든 권한 목록 */
  roles: RoleResponseDTO[] = [];

  /** 권한 목록 기본 값 */
  defaultRoles: string[] = [];

  /** 사용 여부 기본 값 */
  defaultUseYn = 'Y';

  /** 삭제 버튼 사용 여부 */
  useRemove = true;

  /** 데이터 새로고침 이벤트 */
  @Output() refresh = new EventEmitter<void>();

  /** 삭제 버튼 클릭 이벤트 */
  @Output() remove = new EventEmitter<void>();

  /** 닫기 버튼 클릭 이벤트 */
  @Output() close = new EventEmitter<void>();

  ngOnInit() {
    this.detailForm = this.fb.group({

      // 메뉴 정보
      originalMenuId: [''],                       // 기존 메뉴 ID
      menuId: ['', [FormValidator.numeric]],      // 메뉴 ID
      upMenuId: ['', [FormValidator.numeric]],    // 상위 메뉴 ID
      menuName: ['', [                            // 메뉴명
        FormValidator.required,
        FormValidator.maxLength(30)
      ]],
      menuUrl: ['', [                             // 메뉴 URL
        FormValidator.required,
        FormValidator.maxLength(100)]
      ],
      menuOrder: ['', [FormValidator.numeric]],   // 메뉴 순서
      menuDepth: ['', [                           // 메뉴 뎁스
        FormValidator.required,
        FormValidator.numeric
      ]],
      menuShowYn: ['', [FormValidator.required]], // 메뉴 표출 여부
      useYn: ['', [FormValidator.required]],      // 사용 여부

      // 메뉴 권한 정보
      menuRoles: ['', [FormValidator.required]],  // 권한 ID
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.detail && this.detailForm) {
      this.useRemove = true;
      this.roles = this.store.select<RoleResponseDTO[]>('roleList').value;
      this.defaultRoles = this.roles.filter(x => x.roleId === roles.EMPLOYEE).map(x => x.roleId);
      
      if (isObjectEmpty(changes.detail.currentValue)) {
        this.useRemove = false;
        this.detailForm.reset({
          useYn: this.defaultUseYn,
          menuRoles: this.defaultRoles,
        });
        return;
      }

      this.detailForm.patchValue({
        ...this.detail,
        originalMenuId: this.detail.menuId,
        menuRoles: this.detail.menuRoles.map(x => x.roleId) || this.defaultRoles,
      });
    }
  }

  /** 메뉴 정보를 저장한다. */
  @TransformToDto(SaveMenuRequestDTO)
  async onSubmit(value: SaveMenuRequestDTO): Promise<void> {
    const crudName = isEmpty(value.originalMenuId) ? '추가' : '수정';

    const confirm = await this.messageService.confirm1(`메뉴 정보를 ${crudName}하시겠어요?`);
    if (!confirm) return;

    // 메뉴 ID가 없으면 추가 API를 타고
    if (isEmpty(value.originalMenuId)) {
      this.menuService.addMenu$(value)
      .subscribe((data) => {
        this.messageService.toastSuccess(`정상적으로 ${crudName}되었어요.`);
        this.refresh.emit();
      });
    }
    // 있으면 수정 API를 탄다.
    else {
      this.menuService.updateMenu$(value)
      .subscribe((data) => {
        this.messageService.toastSuccess(`정상적으로 ${crudName}되었어요.`);
        this.refresh.emit();
      });
    }
  }

  /** 메뉴를 삭제한다. */
  async onRemove(event: Event): Promise<void> {
    const confirm = await this.messageService.confirm2('메뉴를 삭제하시겠어요?<br>이 작업은 복구할 수 없어요.');
    if (!confirm) return;

    this.menuService.removeMenu$(this.detail.menuId)
    .subscribe(() => {
      this.messageService.toastSuccess('정상적으로 삭제되었어요.');
      this.remove.emit();
    });
  }

  /** 닫기 버튼을 클릭한다. */
  onClose(): void {
    this.close.emit();
  }

}
