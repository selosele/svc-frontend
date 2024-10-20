import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
import { WorkHistoryResponseDTO } from '../human.model';
import { StoreService } from '@app/shared/services';
import { UiTextFieldComponent } from "../../shared/components/form/ui-text-field/ui-text-field.component";

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
    private authService: AuthService,
    private humanService: HumanService,
  ) {}

  /** 인증된 사용자 정보 */
  user: AuthenticatedUser;

  /** 회사 탭 */
  tabs: Tab[] = [];

  /** 선택된 회사 탭 index */
  activeIndex = 0;

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
      joinYmd: [''],                                      // 입사일자
      annualTypeCode: [this.annualTypeCodes],             // 연차발생기준 코드
      vacationTypeCodes: [this.defaultVacationTypeCodes], // 휴가 계산에 포함할 휴가 구분 코드 (기본 값)
    });

    this.caculateVacationForm.get('joinYmd').patchValue(this.workHistoryList?.[this.activeIndex]?.joinYmd);
    this.caculateVacationForm.get('annualTypeCode').patchValue('JOIN_YMD'); // 연차발생기준 코드 기본값 설정: 입사일자

    if (!this.workHistoryListDataLoad) {
      this.listWorkHistory();
    }
  }

  /** 근무이력 목록을 조회한다. */
  listWorkHistory(): void {
    this.humanService.listWorkHistory$({
      ...this.caculateVacationForm.value,
      employeeId: this.user?.employeeId,
    })
    .subscribe((data) => {
      this.store.update('workHistoryList', data);
      this.store.update('workHistoryTabList', data.map(x => ({ title: x.companyName, key: x.workHistoryId })));
      this.store.update('workHistoryListDataLoad', true);
      this.caculateVacationForm.get('joinYmd').patchValue(data[this.activeIndex]?.joinYmd);
      this.humanService.setVacationTableTitle(this.activeIndex);
    });
  }

  /** 탭을 클릭한다. */
  onChange(event: UiTabChangeEvent): void {
    this.activeIndex = event.index;
    this.humanService.setWorkHistoryId(event.activeKey);
    this.humanService.setVacationTableTitle(this.activeIndex);
    this.caculateVacationForm.get('joinYmd').patchValue(this.workHistoryList?.[this.activeIndex]?.joinYmd);
  }

  /** 휴가를 계산한다. */
  onSubmit(value): void {
    this.listWorkHistory();
  }

  /** 휴가 계산 폼을 초기화한다. */
  onReset(): void {
    this.caculateVacationForm.get('vacationTypeCodes').patchValue(this.defaultVacationTypeCodes);
    this.listWorkHistory();
  }

}
