import { Routes } from '@angular/router';
import { roles } from '@app/shared/utils';
import { authGuard, menuGuard } from '@app/shared/guards';
import { codeResolver } from '@app/shared/resolvers';

/** 급여관리 페이지 라우터 */
export const salaryRoutes: Routes = [

  // 급여명세서관리 페이지
  {
    path: 'sa/payslips',
    canActivate: [authGuard, menuGuard],
    resolve: { code: codeResolver },
    data: {
      roles: [roles.EMPLOYEE.id],
      codeKeys: ['SALARY_TYPE_00', 'SALARY_AMOUNT_A00', 'SALARY_AMOUNT_B00'],
    },
    loadComponent: () => import('./salary-payslip/salary-payslip.component').then(x => x.SalaryPayslipComponent),
  },
  
];
