import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UiContentTitleComponent } from '@app/shared/components/ui';
import { FormValidator, UiDropdownComponent, UiSplitFormComponent, UiTextareaComponent, UiTextFieldComponent } from '@app/shared/components/form';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UiMessageService } from '@app/shared/services';
import { CodeService } from '@app/code/code.service';
import { BoardService } from '@app/board/board.service';
import { BoardResultDTO, SaveBoardRequestDTO } from '@app/board/board.model';
import { isEmpty, isObjectEmpty } from '@app/shared/utils';
import { TransformToDto } from '@app/shared/decorators';
import { DropdownData } from '@app/shared/components/form/ui-dropdown/ui-dropdown.model';

@Component({
  standalone: true,
  imports: [
    UiSplitFormComponent,
    UiTextFieldComponent,
    UiTextareaComponent,
    UiDropdownComponent,
    UiContentTitleComponent,
  ],
  selector: 'system-board-detail',
  templateUrl: './system-board-detail.component.html',
  styleUrl: './system-board-detail.component.scss'
})
export class SystemBoardDetailComponent implements OnInit, OnChanges {

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private messageService: UiMessageService,
    private codeService: CodeService,
    private boardService: BoardService,
  ) {}

  /** 게시판 정보 */
  @Input() detail: BoardResultDTO = null;

  /** 게시판 상세 조회 form */
  detailForm: FormGroup;

  /** Y/N 데이터 목록 */
  ynCodes = this.codeService.createYnCodeData();

  /** 게시판 구분 코드 데이터 목록 */
  boardTypeCodes: DropdownData[];

  /** 게시판 구분 코드 기본 값 */
  defaultBoardTypeCode = 'NORMAL';

  /** 메인 화면 표출 여부 기본 값 */
  defaultMainShowYn = 'N';

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
    this.route.data.subscribe(({ code }) => {
      this.boardTypeCodes = code['BOARD_TYPE_00'];
    });

    this.detailForm = this.fb.group({
      boardId: [''],                                      // 게시판 ID
      boardName: ['', [                                   // 게시판명
        FormValidator.required,
        FormValidator.maxLength(30)
      ]],
      boardContent: ['', [                                // 게시판 내용
        FormValidator.required,
        FormValidator.maxLength(255)
      ]],
      boardTypeCode: ['', [FormValidator.required]],      // 게시판 구분 코드
      boardOrder: ['', [FormValidator.numeric]],          // 게시판 순서
      mainShowYn: ['', [FormValidator.required]],         // 메인 화면 표출 여부
      useYn: ['', [FormValidator.required]],              // 사용 여부
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.detail && this.detailForm) {
      this.useRemove = true;
      
      if (isObjectEmpty(changes.detail.currentValue)) {
        this.useRemove = false;
        this.detailForm.reset({
          boardTypeCode: this.defaultBoardTypeCode,
          mainShowYn: this.defaultMainShowYn,
          useYn: this.defaultUseYn,
        });
        return;
      }

      this.detailForm.patchValue(this.detail);
    }
  }

  /** 게시판을 저장한다. */
  @TransformToDto(SaveBoardRequestDTO)
  async onSubmit(value: SaveBoardRequestDTO): Promise<void> {
    const crudName = isEmpty(value.boardId) ? '등록' : '수정';

    const confirm = await this.messageService.confirm1(`게시판을 ${crudName}하시겠어요?`);
    if (!confirm) return;

    // 게시판 ID가 없으면 추가 API를 타고
    if (isEmpty(value.boardId)) {
      this.boardService.addBoard$(value)
      .subscribe((response) => {
        this.messageService.toastSuccess(`정상적으로 ${crudName}되었어요.`);
        this.detailForm.get('boardId').patchValue(response.board.boardId);
        this.refresh.emit();
      });
    }
    // 있으면 수정 API를 탄다.
    else {
      this.boardService.updateBoard$(value)
      .subscribe((response) => {
        this.messageService.toastSuccess(`정상적으로 ${crudName}되었어요.`);
        this.refresh.emit();
      });
    }
  }

  /** 게시판을 삭제한다. */
  async onRemove(event: Event): Promise<void> {
    const confirm = await this.messageService.confirm2('게시판을 삭제하시겠어요?<br>이 작업은 복구할 수 없어요.');
    if (!confirm) return;

    this.boardService.removeBoard$(this.detail.boardId)
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
