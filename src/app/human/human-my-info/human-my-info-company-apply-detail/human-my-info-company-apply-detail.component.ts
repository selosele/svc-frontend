import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HumanService } from '@app/human/human.service';
import { CompanyApplyResponseDTO } from '@app/human/human.model';
import { UiMessageService } from '@app/shared/services';
import { isObjectEmpty } from '@app/shared/utils';

@Component({
  standalone: true,
  imports: [],
  selector: 'human-my-info-company-apply-detail',
  templateUrl: './human-my-info-company-apply-detail.component.html',
  styleUrl: './human-my-info-company-apply-detail.component.scss'
})
export class HumanMyInfoCompanyApplyDetailComponent implements OnInit, OnChanges {

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private messageService: UiMessageService,
    private humanService: HumanService,
  ) {}

  /** 회사등록신청 정보 */
  @Input() detail: CompanyApplyResponseDTO = null;

  /** 회사등록신청 상세 조회 폼 */
  detailForm: FormGroup;

  /** 삭제 버튼 사용 여부 */
  useRemove = true;

  /** 데이터 새로고침 이벤트 */
  @Output() refresh = new EventEmitter<void>();

  /** 삭제 버튼 클릭 이벤트 */
  @Output() remove = new EventEmitter<void>();

  /** 닫기 버튼 클릭 이벤트 */
  @Output() close = new EventEmitter<void>();

  ngOnInit(): void {
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.detail && this.detailForm) {
      this.useRemove = true;
      this.detailForm.reset();

      if (isObjectEmpty(changes.detail.currentValue)) {
        this.useRemove = false;
        return;
      }
      
      this.detailForm.patchValue(this.detail);
    }
  }

  /** 닫기 버튼을 클릭한다. */
  onClose(): void {
    this.close.emit();
  }

}
