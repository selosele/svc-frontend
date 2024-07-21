import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CodeResponseDTO } from '@app/code/code.model';
import { CodeService } from '@app/code/code.service';
import { UiDropdownComponent, UiFormComponent, UiTextFieldComponent } from '@app/shared/components';
import { DropdownData } from '@app/shared/models';
import { UiMessageService } from '@app/shared/services';
import { isNotObjectEmpty } from '@app/shared/utils';

@Component({
  standalone: true,
  imports: [
    UiFormComponent,
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

  /** input readonly 여부 */
  get isReadonly(): boolean {
    return isNotObjectEmpty(this.codeDetail);
  }

  /** 데이터 새로고침 이벤트 */
  @Output() refresh = new EventEmitter<void>();

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
      this.codeDetailForm.patchValue(this.codeDetail);
    }
  }

  /** 코드 상세 정보를 저장한다. */
  onSubmit(value: any): void {
    
  }

}
