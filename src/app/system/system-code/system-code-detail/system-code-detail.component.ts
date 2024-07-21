import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CodeResponseDTO } from '@app/code/code.model';
import { CodeService } from '@app/code/code.service';
import { UiDropdownComponent, UiSplitFormComponent, UiTextFieldComponent } from '@app/shared/components';
import { DropdownData } from '@app/shared/models';
import { UiMessageService } from '@app/shared/services';
import { isNotObjectEmpty } from '@app/shared/utils';

@Component({
  standalone: true,
  imports: [
    UiSplitFormComponent,
    UiTextFieldComponent,
    UiDropdownComponent,
  ],
  selector: 'system-code-detail',
  templateUrl: './system-code-detail.component.html',
  styleUrl: './system-code-detail.component.scss'
})
export class SystemCodeDetailComponent implements OnInit, OnChanges {

  constructor(
    private fb: FormBuilder,
    private messageService: UiMessageService,
    private codeService: CodeService,
  ) {}

  /** 코드 상세 정보 */
  @Input() codeDetail: CodeResponseDTO = null;

  /** 코드 상세 조회 폼 */
  codeDetailForm: FormGroup;

  /** 사용 여부 데이터 목록 */
  useYns: DropdownData[] = this.codeService.getDropdownYnData();

  /** 삭제 버튼 사용 여부 */
  useRemove = true;

  /** input readonly 여부 */
  get isReadonly(): boolean {
    return isNotObjectEmpty(this.codeDetail);
  }

  /** 데이터 새로고침 이벤트 */
  @Output() refresh = new EventEmitter<void>();

  /** 사용자 정보 저장 이벤트 */
  @Output() submit = new EventEmitter<any>();

  /** 삭제 버튼 클릭 이벤트 */
  @Output() remove = new EventEmitter<void>();

  /** 닫기 버튼 클릭 이벤트 */
  @Output() close = new EventEmitter<void>();

  ngOnInit(): void {
    this.codeDetailForm = this.fb.group({
      codeId: [''],       // 코드 ID
      upCodeId: [''],     // 상위 코드 ID
      codeValue: [''],    // 코드 값
      codeName: [''],     // 코드 명
      codeContent: [''],  // 코드 내용
      codeOrder: [''],    // 코드 순서
      codeDepth: [''],    // 코드 뎁스
      useYn: [''],        // 사용 여부
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.codeDetail && this.codeDetailForm) {
      this.useRemove = true;
      this.codeDetailForm.patchValue(this.codeDetail);
    }
  }

  /** 코드 상세 정보를 저장한다. */
  onSubmit(value: any): void {
    this.submit.emit(value);
  }

  /** 코드를 삭제한다. */
  async removeCode(event: Event): Promise<void> {
    const confirm = await this.messageService.confirm2(event, '선택한 코드를 삭제하시겠습니까?<br>이 작업은 복구할 수 없습니다.');
    if (!confirm) return;

    this.remove.emit();
  }

  /** 닫기 버튼을 클릭한다. */
  onClose(): void {
    this.close.emit();
  }

}
