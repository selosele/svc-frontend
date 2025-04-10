import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { CoreBaseComponent } from '@app/shared/components/core';
import { LayoutPageDescriptionComponent } from '@app/shared/components/layout';
import { UiButtonComponent, UiCardComponent, UiContentTitleComponent, UiSkeletonComponent, UiTabComponent } from '@app/shared/components/ui';
import { HumanVacationListComponent } from './human-vacation-list/human-vacation-list.component';
import { MyHolidayComponent } from '@app/holiday/my-holiday/my-holiday.component';
import { DropdownData } from '@app/shared/components/form/ui-dropdown/ui-dropdown.model';
import { UiFormComponent } from '@app/shared/components/form/ui-form/ui-form.component';
import { UiDropdownComponent } from '@app/shared/components/form';
import { UiCheckboxComponent } from '@app/shared/components/form/ui-checkbox/ui-checkbox.component';
import { UiCheckboxGroupComponent } from '@app/shared/components/form/ui-checkbox-group/ui-checkbox-group.component';
import { UiCheckboxListComponent } from '@app/shared/components/form/ui-checkbox-list/ui-checkbox-list.component';
import { Tab, UiTabChangeEvent } from '@app/shared/components/ui/ui-tab/ui-tab.model';
import { AddVacationCalcRequestDTO } from '@app/vacation/vacation.model';
import { WorkHistoryService } from '@app/work-history/work-history.service';
import { VacationStore } from '@app/vacation/vacation.store';
import { VacationService } from '@app/vacation/vacation.service';
import { UiMessageService } from '@app/shared/services';
import { UiTextFieldComponent } from '../../shared/components/form/ui-text-field/ui-text-field.component';
import { dateUtil, isNotBlank } from '@app/shared/utils';
import { WorkHistoryResponseDTO, WorkHistoryResultDTO } from '@app/work-history/work-history.model';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    UiSkeletonComponent,
    UiTabComponent,
    UiFormComponent,
    UiTextFieldComponent,
    UiDropdownComponent,
    UiCheckboxListComponent,
    UiCheckboxGroupComponent,
    UiCheckboxComponent,
    UiCardComponent,
    UiButtonComponent,
    UiContentTitleComponent,
    LayoutPageDescriptionComponent,
    HumanVacationListComponent,
    MyHolidayComponent,
  ],
  selector: 'view-human-vacation',
  templateUrl: './human-vacation.component.html',
  styleUrl: './human-vacation.component.scss'
})
export class HumanVacationComponent extends CoreBaseComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private messageService: UiMessageService,
    private vacationStore: VacationStore,
    private vacationService: VacationService,
    private workHistoryService: WorkHistoryService,
  ) {
    super();
  }

  /** 최신 근무이력 정보 */
  currentWorkHistoryResponse: WorkHistoryResponseDTO;

  /** 최신 근무이력 ID */
  currentWorkHistoryId: number;

  /** 회사 탭 */
  tabs: Tab[] = [];

  // /**
  //  * 선택된 회사 탭의 index
  //  *   -다른 페이지로 갔다가 다시 돌아와도 클릭했던 탭을 유지하고자 상태관리
  //  */
  // get activeIndex() {
  //   return this.vacationStore.select<number>('vacationWorkHistoryTabIndex').value;
  // }

  // /** 선택된 회사 탭의 index를 변경한다. */
  // set activeIndex(value: number) {
  //   this.vacationStore.update('vacationWorkHistoryTabIndex', value);
  // }

  /** 선택된 회사 탭의 index */
  activeIndex = 0;

  /** 선택된 회사 탭의 근무이력 ID */
  activeWorkHistoryId: number;

  /** 휴가 계산 form */
  caculateVacationForm: FormGroup;

  /** 연차발생기준 코드 데이터 목록 */
  annualTypeCodes: DropdownData[];

  /** 휴가 구분 코드 데이터 목록 */
  vacationTypeCodes: DropdownData[];

  /** 휴가 계산에 포함할 휴가 구분 코드 목록 (기본 값) */
  defaultVacationTypeCodes = ['ANNUAL', 'MONTH', 'MORNING', 'AFTERNOON', 'PAID', 'UNPAID', 'SICK'];

  /** 휴가 테이블 타이틀 */
  get vacationTableTitle() {
    return this.vacationStore.select<string>('vacationTableTitle').value;
  }

  /** 휴가 테이블 텍스트 */
  get vacationTableText() {
    return this.vacationStore.select<string>('vacationTableText').value;
  }

  /** 근무이력 탭 목록 */
  get workHistoryTabList() {
    return this.vacationStore.select<Tab[]>('vacationWorkHistoryTabList').value;
  }

  /** 근무이력 목록 데이터 로드 완료 여부 */
  get workHistoryListDataLoad() {
    const data = this.vacationStore.select<Tab[]>('vacationWorkHistoryTabList').value;
    return data?.find(x => x.key === this.activeWorkHistoryId)?.dataLoad ?? false;
  }

  /** 근무이력 목록 */
  get workHistoryList() {
    return this.vacationStore.select<WorkHistoryResultDTO[]>('vacationWorkHistoryList').value;
  }

  async ngOnInit() {
    this.route.data.subscribe(({ code }) => {
      this.annualTypeCodes = code['ANNUAL_TYPE_00'];
      this.vacationTypeCodes = code['VACATION_TYPE_00'];
    });

    this.currentWorkHistoryResponse = await lastValueFrom(this.workHistoryService.getCurrentWorkHistory$(this.user?.employeeId));
    this.currentWorkHistoryId = this.currentWorkHistoryResponse?.workHistory?.workHistoryId;

    this.vacationService.setWorkHistoryId(this.currentWorkHistoryId);

    this.caculateVacationForm = this.fb.group({
      workHistoryId: [this.currentWorkHistoryId],         // 근무이력 ID
      employeeId: [this.user?.employeeId],                // 직원 ID
      joinYmd: [''],                                      // 입사일자
      quitYmd: [''],                                      // 퇴사일자
      annualTypeCode: [this.annualTypeCodes],             // 연차발생기준 코드
      vacationTypeCodes: [this.defaultVacationTypeCodes], // 휴가 계산에 포함할 휴가 구분 코드 (기본 값)
    });

    this.activeWorkHistoryId = this.currentWorkHistoryId;

    if (this.user) {
      this.listVacationCalc(this.activeWorkHistoryId);
    }
  }

  /** 탭을 클릭한다. */
  onChange(event: UiTabChangeEvent): void {
    this.activeIndex = event.index;
    this.activeWorkHistoryId = Number(event.activeKey);

    this.setAnnualTypeCode();
    //this.listWorkHistory();
    this.listVacationCalc(this.activeWorkHistoryId);
    
    this.vacationService.setWorkHistoryId(this.activeWorkHistoryId);
    this.vacationService.setVacationTableContent(this.activeIndex);
  }

  /** 연차발생기준을 선택한다. */
  onAnnualTypeCodeChange(event: DropdownChangeEvent): void {
    const nowDate = dateUtil(dateUtil().format('YYYYMMDD'));
    const joinYmd = this.caculateVacationForm.get('joinYmd').value;
    
    // 근속 1년 미만 and 회계연도를 선택했을 경우
    // TODO: 근속 1년 미만이지만 회계연도 기준으로 연차를 부여하는 회사도 있으므로 아래 로직은 주석처리
    // if (nowDate.diff(dateUtil(joinYmd), 'year') < 1 && event.value === 'FISCAL_YEAR') {
    //   this.messageService.toastInfo('근속 1년 미만일 경우 회계연도 기준으로 조회할 수 없어요.');
    //   this.caculateVacationForm.get('annualTypeCode').patchValue('JOIN_YMD');
    //   return;
    // }

    // 근속 1년 이상일 경우 and 입사일자를 선택했을 경우
    if (nowDate.diff(dateUtil(joinYmd), 'year') >= 1 && event.value === 'JOIN_YMD') {
      this.messageService.toastInfo('근속 1년 이상일 경우 입사일자 기준으로 조회할 수 없어요.');
      this.caculateVacationForm.get('annualTypeCode').patchValue('FISCAL_YEAR');
      return;
    }

    // 회계연도를 선택했을 경우
    if (event.value === 'FISCAL_YEAR') {
      this.caculateVacationForm.get('vacationTypeCodes').patchValue(this.defaultVacationTypeCodes.filter(x => x != 'MONTH'));
    }
    // 입사일자를 선택했을 경우
    else if (event.value === 'JOIN_YMD') {
      this.caculateVacationForm.get('vacationTypeCodes').patchValue(this.defaultVacationTypeCodes.filter(x => x != 'ANNUAL'));
    }

    this.listWorkHistory();
  }

  /** 휴가를 계산한다. */
  onSubmit(value): void {
    this.listWorkHistory();
  }

  /** 휴가 계산 form을 초기화한다. */
  onReset(): void {
    // this.setAnnualTypeCode();
    this.listVacationCalc(this.activeWorkHistoryId);
    this.listWorkHistory();
  }

  /** 휴가 계산 설정을 저장한다. */
  onSave(): void {
    this.vacationService.addVacationCalc$({
      ...this.caculateVacationForm.value as AddVacationCalcRequestDTO,
      workHistoryId: this.activeWorkHistoryId,
    })
    .subscribe(() => {
      this.messageService.toastSuccess('휴가계산 설정이 저장되었어요.');
    });
  }

  /** 근무이력 목록을 다시 조회한다. */
  onRefresh(): void {
    this.listWorkHistory();
  }

  /** 근무이력 목록을 조회한다. */
  private listWorkHistory(): void {
    this.workHistoryService.listWorkHistory$({
      ...this.caculateVacationForm.value,
      employeeId: this.user?.employeeId,
    })
    .subscribe((response) => {
      this.vacationStore.update('vacationWorkHistoryList', response.workHistoryList);
      this.vacationStore.update('vacationWorkHistoryTabList', response.workHistoryList.map(x => ({ title: x.companyName, key: x.workHistoryId, dataLoad: true })));

      this.caculateVacationForm.get('joinYmd').patchValue(response.workHistoryList[this.activeIndex]?.joinYmd);
      this.caculateVacationForm.get('quitYmd').patchValue(response.workHistoryList[this.activeIndex]?.quitYmd);
      this.vacationService.setVacationTableContent(this.activeIndex);
    });
  }

  /** 휴가 계산 설정 목록을 조회한다. */
  private listVacationCalc(workHistoryId: number): void {
    this.vacationService.listVacationCalc$(workHistoryId)
    .subscribe((response) => {
      this.setAnnualTypeCode();

      // 사용자 지정 휴가계산설정이 있으면 설정해준다.
      if (response.vacationCalcList?.length > 0) {
        // this.caculateVacationForm.get('annualTypeCode').patchValue(response.vacationCalcList[0].annualTypeCode);
        this.caculateVacationForm.get('vacationTypeCodes').patchValue(response.vacationCalcList.map(x => x.vacationTypeCode));
      }

      this.setJoinYmd();

      //if (!this.workHistoryListDataLoad) {
        this.listWorkHistory();
      //}
    });
  }

  /** 연차발생기준 코드 값을 설정한다. */
  private setAnnualTypeCode(): void {
    const joinYmd = this.workHistoryList?.[this.activeIndex]?.joinYmd || this.currentWorkHistoryResponse?.workHistory?.joinYmd;
    const quitYmd = this.workHistoryList?.[this.activeIndex]?.quitYmd || this.currentWorkHistoryResponse?.workHistory?.quitYmd;
    const nowDate = isNotBlank(quitYmd) ? dateUtil(dateUtil(quitYmd).format('YYYYMMDD')) : dateUtil(dateUtil().format('YYYYMMDD'));

    // 근속 1년 미만일 경우
    if (nowDate.diff(dateUtil(joinYmd), 'year') < 1) {
      this.caculateVacationForm.get('annualTypeCode').patchValue('JOIN_YMD');
      this.caculateVacationForm.get('vacationTypeCodes').patchValue(this.defaultVacationTypeCodes.filter(x => x != 'ANNUAL'));
    }
    // 근속 1년 이상일 경우
    else {
      this.caculateVacationForm.get('annualTypeCode').patchValue('FISCAL_YEAR');
      this.caculateVacationForm.get('vacationTypeCodes').patchValue(this.defaultVacationTypeCodes.filter(x => x != 'MONTH'));
    }
  }

  /** 입사일자 값을 설정한다. */
  private setJoinYmd(): void {
    const joinYmd = this.workHistoryList?.[this.activeIndex]?.joinYmd || this.currentWorkHistoryResponse?.workHistory?.joinYmd;
    const quitYmd = this.workHistoryList?.[this.activeIndex]?.quitYmd || this.currentWorkHistoryResponse?.workHistory?.quitYmd;
    this.caculateVacationForm.get('joinYmd').patchValue(joinYmd);
    this.caculateVacationForm.get('quitYmd').patchValue(quitYmd);
  }

}
