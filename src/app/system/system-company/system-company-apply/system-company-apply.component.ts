import { Component, OnInit } from '@angular/core';
import { UiSkeletonComponent, UiSplitterComponent, UiTableComponent } from '@app/shared/components/ui';

@Component({
  standalone: true,
  imports: [
    UiSkeletonComponent,
    UiSplitterComponent,
    UiTableComponent,
  ],
  selector: 'view-system-company-apply',
  templateUrl: './system-company-apply.component.html',
  styleUrl: './system-company-apply.component.scss'
})
export class SystemCompanyApplyComponent implements OnInit {

  /** 테이블 컬럼 */
  cols = [
    { field: 'companyName',        header: '회사명' },
    { field: 'corporateName',      header: '법인명' },
    { field: 'registrationNo',     header: '사업자등록번호' },
    { field: 'applyContent',       header: '내용' },
    { field: 'applyDt',            header: '신청일시' },
    { field: 'applyStateCodeName', header: '신청상태' },
  ];

  ngOnInit() {
    
  }

}
