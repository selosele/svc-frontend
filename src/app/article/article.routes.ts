import { Routes } from '@angular/router';
import { roles } from '@app/shared/utils';
import { authGuard, menuGuard } from '@app/shared/guards';
import { codeResolver } from '@app/shared/resolvers';

/** 게시글 페이지 라우터 */
export const articleRoutes: Routes = [

  // 게시글 목록 페이지
  {
    path: 'co/boards/:boardId',
    canActivate: [authGuard, menuGuard],
    resolve: { code: codeResolver },
    data: {
      roles: [roles.EMPLOYEE.id],
      codeKeys: ['BOARD_TYPE_00'],
    },
    loadComponent: () => import('./article-list/article-list.component').then(x => x.ArticleListComponent),
  },
  
];
