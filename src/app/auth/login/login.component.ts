import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CoreBaseComponent } from '@app/shared/components/core';
import { FormValidator, UiCheckboxComponent, UiFormComponent, UiTextFieldComponent } from '@app/shared/components/form';
import { UiButtonComponent, UiCardComponent } from '@app/shared/components/ui';
import { UiDialogService, UiLoadingService } from '@app/shared/services';
import { AuthStore } from '../auth.store';
import { ArticleService } from '@app/article/article.service';
import { BoardService } from '@app/board/board.service';
import { isNotBlank, isObjectEmpty } from '@app/shared/utils';
import { LoginRequestDTO } from '../auth.model';
import { FindMyInfoComponent } from '../find-my-info/find-my-info.component';
import { ArticleResultDTO } from '@app/article/article.model';
import { ArticleViewComponent } from '@app/article/article-view/article-view.component';
import { ArticleListComponent } from '@app/article/article-list/article-list.component';
import { ArticleStore } from '@app/article/article.store';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    UiCardComponent,
    UiFormComponent,
    UiButtonComponent,
    UiTextFieldComponent,
    UiCheckboxComponent,
],
  selector: 'view-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent extends CoreBaseComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private authStore: AuthStore,
    private articleStore: ArticleStore,
    private dialogService: UiDialogService,
    private loadingService: UiLoadingService,
    private articleService: ArticleService,
    private boardService: BoardService,
  ) {
    super();
  }

  /** 로그인 폼 */
  loginForm: FormGroup;

  /** 로컬스토리지에 저장된 사용자 계정 */
  savedUserAccount: string;

  /** 공지사항 게시글 목록 */
  get noticeList() {
    return this.articleStore.select<ArticleResultDTO[]>('noticeList').value;
  }

  /** 공지사항 게시글 목록 데이터 로드 완료 여부 */
  get noticeListDataLoad() {
    return this.articleStore.select<boolean>('noticeListDataLoad').value;
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      userAccount:  ['', [FormValidator.required]], // 사용자 계정
      userPassword: ['', [FormValidator.required]], // 사용자 비밀번호
      saveUserAccountYn: [''],                      // 아이디 저장 여부
    });

    // 아이디 저장 여부 값에 따른 설정
    this.savedUserAccount = this.authService.getSavedUserAccount();
    if (isNotBlank(this.savedUserAccount)) {
      this.loginForm.patchValue({
        userAccount: this.savedUserAccount,
        saveUserAccountYn: ['Y'],
      });
    }

    if (!this.noticeListDataLoad) {
      this.listArticle();
    }
  }
  
  /** 로그인을 한다. */
  onSubmit(value: LoginRequestDTO): void {
    this.authService.login(value);
  }

  /** 아이디/비밀번호 찾기 modal을 표출한다. */
  showFindMyInfoModal(event: Event): void {
    const modal = this.dialogService.open(FindMyInfoComponent, {
      focusOnShow: false,
      header: '아이디/비밀번호 찾기',
    });

    modal.onClose.subscribe((data) => {
      this.authStore.update('userCertHistory', null);
    });
  }

  /** 공지사항을 조회한다. */
  getArticle(articleId: number): void {
    const loadingTimeout = setTimeout(() => this.loadingService.setLoading(true), 500);

    this.articleService.getArticle$(articleId)
    .subscribe((response) => {
      clearTimeout(loadingTimeout);
      this.loadingService.setLoading(false);

      const modal = this.dialogService.open(ArticleViewComponent, {
        focusOnShow: false,
        header: response.article.articleTitle,
        width: '1000px',
        data: response,
      });

      modal?.onClose.subscribe((result) => {
        if (isObjectEmpty(result)) return;

        // 게시글 새로고침(예: 이전/다음 게시글로 이동)
        if (result.action === 'reload') {
          this.getArticle(result.data.articleId);
        }
      });
    });
  }

  /** 공지사항 목록을 조회한다. */
  listArticle(): void {
    this.articleService.listArticle$({ boardId: 2 })
    .subscribe((response) => {
      this.articleStore.update('noticeListDataLoad', true);
      this.articleStore.update('noticeList', response.articleList);
    });
  }

  /** 공지사항 목록 modal을 표출한다. */
  listArticleModal(boardId: number): void {
    const loadingTimeout = setTimeout(() => this.loadingService.setLoading(true), 500);

    this.boardService.getBoard$(boardId)
    .subscribe((response) => {
      clearTimeout(loadingTimeout);
      this.loadingService.setLoading(false);

      this.dialogService.open(ArticleListComponent, {
        focusOnShow: false,
        header: response.board.boardName,
        width: '1200px',
        height: '100%',
        data: { boardId, from: 'login' },
      });
    });
  }
  
}
