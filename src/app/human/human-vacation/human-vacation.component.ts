import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { LayoutPageDescriptionComponent } from '@app/shared/components/layout';
import { UiButtonComponent, UiCardComponent, UiContentTitleComponent, UiSkeletonComponent, UiTabComponent } from '@app/shared/components/ui';
import { AuthenticatedUser } from '@app/auth/auth.model';
import { AuthService } from '@app/auth/auth.service';
import { HumanService } from '../human.service';
import { HumanVacationListComponent } from './human-vacation-list/human-vacation-list.component';
import { MyHolidayComponent } from '@app/holiday/my-holiday/my-holiday.component';
import { DropdownData } from '@app/shared/components/form/ui-dropdown/ui-dropdown.model';
import { UiFormComponent } from '@app/shared/components/form/ui-form/ui-form.component';
import { UiDropdownComponent } from '@app/shared/components/form';
import { UiCheckboxComponent } from '@app/shared/components/form/ui-checkbox/ui-checkbox.component';
import { UiCheckboxGroupComponent } from '@app/shared/components/form/ui-checkbox-group/ui-checkbox-group.component';
import { UiCheckboxListComponent } from '@app/shared/components/form/ui-checkbox-list/ui-checkbox-list.component';
import { Tab, UiTabChangeEvent } from '@app/shared/components/ui/ui-tab/ui-tab.model';
import { AddVacationCalcRequestDTO, WorkHistoryResponseDTO } from '../human.model';
import { StoreService, UiMessageService } from '@app/shared/services';
import { UiTextFieldComponent } from "../../shared/components/form/ui-text-field/ui-text-field.component";
import { dateUtil } from '@app/shared/utils';
import { MenuService } from '@app/menu/menu.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    UiSkeletonComponent,
    UiTabComponent,
    UiFormComponent,
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
    UiTextFieldComponent
  ],
  selector: 'view-human-vacation',
  templateUrl: './human-vacation.component.html',
  styleUrl: './human-vacation.component.scss'
})
export class HumanVacationComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private store: StoreService,
    private messageService: UiMessageService,
    private authService: AuthService,
    private humanService: HumanService,
    protected menuService: MenuService,
  ) {}

  /** 인증된 사용자 정보 */
  user: AuthenticatedUser;

  /** 회사 탭 */
  tabs: Tab[] = [];

  /** 선택된 회사 탭의 index */
  activeIndex = 0;

  /** 선택된 회사 탭의 근무이력 ID */
  activeWorkHistoryId: number;

  /** 휴가 계산 폼 */
  caculateVacationForm: FormGroup;

  /** 연차발생기준 코드 데이터 목록 */
  annualTypeCodes: DropdownData[];

  /** 휴가 구분 코드 데이터 목록 */
  vacationTypeCodes: DropdownData[];

  /** 휴가 계산에 포함할 휴가 구분 코드 목록 (기본 값) */
  defaultVacationTypeCodes = ['ANNUAL', 'MONTH', 'MORNING', 'AFTERNOON', 'PAID', 'UNPAID', 'SICK'];

  /** 휴가 테이블 타이틀 */
  get vacationTableTitle() {
    return this.store.select<string>('vacationTableTitle').value;
  }

  /** 휴가 테이블 텍스트 */
  get vacationTableText() {
    return this.store.select<string>('vacationTableText').value;
  }

  /** 근무이력 탭 목록 */
  get workHistoryTabList() {
    return this.store.select<Tab[]>('workHistoryTabList').value;
  }

  /** 근무이력 목록 */
  get workHistoryList() {
    return this.store.select<WorkHistoryResponseDTO[]>('workHistoryList').value;
  }

  /** 근무이력 목록 데이터 로드 완료 여부 */
  get workHistoryListDataLoad() {
    return this.store.select<boolean>('workHistoryListDataLoad').value;
  }

  /** 재직 중인 회사인지 여부 */
  get isNotQuit$() {
    return this.store.select<boolean>('isNotQuit').asObservable();
  }

  ngOnInit() {
    this.route.data.subscribe(({ code }) => {
      this.annualTypeCodes = code['ANNUAL_TYPE_00'];
      this.vacationTypeCodes = code['VACATION_TYPE_00'];
    });

    this.user = this.authService.getAuthenticatedUser();
    this.humanService.setWorkHistoryId(parseInt(`${this.user?.workHistoryId}`));

    this.caculateVacationForm = this.fb.group({
      workHistoryId: [this.user?.workHistoryId],          // 근무이력 ID
      employeeId: [this.user?.employeeId],                // 직원 ID
      joinYmd: [''],                                      // 입사일자
      quitYmd: [''],                                      // 퇴사일자
      annualTypeCode: [this.annualTypeCodes],             // 연차발생기준 코드
      vacationTypeCodes: [this.defaultVacationTypeCodes], // 휴가 계산에 포함할 휴가 구분 코드 (기본 값)
    });

    this.activeWorkHistoryId = this.user?.workHistoryId;
    this.listVacationCalc(this.activeWorkHistoryId);
  }

  /** 탭을 클릭한다. */
  onChange(event: UiTabChangeEvent): void {
    this.activeIndex = event.index;
    this.activeWorkHistoryId = event.activeKey;

    this.setAnnualTypeCode();
    //this.listWorkHistory();
    this.listVacationCalc(event.activeKey);
    
    this.humanService.setWorkHistoryId(event.activeKey);
    this.humanService.setVacationTableContent(this.activeIndex);
  }

  /** 연차발생기준을 선택한다. */
  onAnnualTypeCodeChange(event: DropdownChangeEvent): void {
    const nowDate = dateUtil(dateUtil().format('YYYYMMDD'));
    const joinYmd = this.caculateVacationForm.get('joinYmd').value;
    
    // 근속 1년 미만 and 회계연도를 선택했을경우
    // TODO: 근속 1년 미만이지만 회계연도 기준으로 연차를 부여하는 회사도 있으므로 아래 로직은 주석처리
    // if (nowDate.diff(dateUtil(joinYmd), 'year') < 1 && event.value === 'FISCAL_YEAR') {
    //   this.messageService.toastInfo('근속 1년 미만일 경우 회계연도 기준으로 조회할 수 없어요.');
    //   this.caculateVacationForm.get('annualTypeCode').patchValue('JOIN_YMD');
    //   return;
    // }

    // 근속 1년 이상일경우 and 입사일자를 선택했을경우
    if (nowDate.diff(dateUtil(joinYmd), 'year') >= 1 && event.value === 'JOIN_YMD') {
      this.messageService.toastInfo('근속 1년 이상일 경우 입사일자 기준으로 조회할 수 없어요.');
      this.caculateVacationForm.get('annualTypeCode').patchValue('FISCAL_YEAR');
      return;
    }

    // 회계연도를 선택했을경우
    if (event.value === 'FISCAL_YEAR') {
      this.caculateVacationForm.get('vacationTypeCodes').patchValue(this.defaultVacationTypeCodes.filter(x => x != 'MONTH'));
    }
    // 입사일자를 선택했을경우
    else if (event.value === 'JOIN_YMD') {
      this.caculateVacationForm.get('vacationTypeCodes').patchValue(this.defaultVacationTypeCodes.filter(x => x != 'ANNUAL'));
    }

    this.listWorkHistory();
  }

  /** 휴가를 계산한다. */
  onSubmit(value): void {
    this.listWorkHistory();
  }

  /** 휴가 계산 폼을 초기화한다. */
  onReset(): void {
    this.setAnnualTypeCode();
    this.listWorkHistory();
  }

  /** 휴가 계산 설정을 저장한다. */
  onSave(): void {
    this.humanService.addVacationCalc$({
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
    this.humanService.listWorkHistory$({
      ...this.caculateVacationForm.value,
      employeeId: this.user?.employeeId,
    })
    .subscribe((data) => {
      this.store.update('workHistoryList', data);
      this.store.update('workHistoryTabList', data.map(x => ({ title: x.companyName, key: x.workHistoryId })));
      this.store.update('workHistoryListDataLoad', true);
      this.caculateVacationForm.get('joinYmd').patchValue(data[this.activeIndex]?.joinYmd);
      this.caculateVacationForm.get('quitYmd').patchValue(data[this.activeIndex]?.quitYmd);
      this.humanService.setVacationTableContent(this.activeIndex);
    });
  }

  /** 휴가 계산 설정 목록을 조회한다. */
  private listVacationCalc(workHistoryId: number): void {
    this.humanService.listVacationCalc$(workHistoryId)
    .subscribe((data) => {

      // 사용자 지정 휴가계산설정이 있으면 설정해주고
      if (data?.length > 0) {
        this.caculateVacationForm.get('annualTypeCode').patchValue(data[0].annualTypeCode);
        this.caculateVacationForm.get('vacationTypeCodes').patchValue(data.map(x => x.vacationTypeCode));
      }
      // 없으면 기본 값을 설정한다.
      else {
        this.setAnnualTypeCode();
      }

      this.setJoinYmd();

      // TODO: 2024.10.27. 다른 페이지로 갔다가 다시 휴가관리 페이지로 이동시, 탭은 첫 번째 탭이 활성화돼 있는데
      // 페이지 이동 전에 클릭했던 탭의 콘텐츠가 활성화돼 있는 이슈로 인해 주석처리
      // 예) 페이지 이동 전에 두 번째 탭 클릭 -> 다시 페이지 이동시 첫 번째 탭 활성화 및 두 번째 탭의 콘텐츠 활성화되어 있는 이슈
      // 상태관리 로직 개선 예정
      //if (!this.workHistoryListDataLoad) {
        this.listWorkHistory();
      //}
    });
  }

  /** 연차발생기준 코드 값을 설정한다. */
  private setAnnualTypeCode(): void {
    const nowDate = dateUtil(dateUtil().format('YYYYMMDD'));
    const joinYmd = this.workHistoryList?.[this.activeIndex]?.joinYmd || this.user?.joinYmd;

    // 근속 1년 미만일경우
    if (nowDate.diff(dateUtil(joinYmd), 'year') < 1) {
      this.caculateVacationForm.get('annualTypeCode').patchValue('JOIN_YMD');
      this.caculateVacationForm.get('vacationTypeCodes').patchValue(this.defaultVacationTypeCodes.filter(x => x != 'ANNUAL'));
    }
    // 근속 1년 이상일경우
    else {
      this.caculateVacationForm.get('annualTypeCode').patchValue('FISCAL_YEAR');
      this.caculateVacationForm.get('vacationTypeCodes').patchValue(this.defaultVacationTypeCodes.filter(x => x != 'MONTH'));
    }
  }

  /** 입사일자 값을 설정한다. */
  private setJoinYmd(): void {
    const joinYmd = this.workHistoryList?.[this.activeIndex]?.joinYmd || this.user?.joinYmd;
    const quitYmd = this.workHistoryList?.[this.activeIndex]?.quitYmd || this.user?.quitYmd;
    this.caculateVacationForm.get('joinYmd').patchValue(joinYmd);
    this.caculateVacationForm.get('quitYmd').patchValue(quitYmd);
  }

}
