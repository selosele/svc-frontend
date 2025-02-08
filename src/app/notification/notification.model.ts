import { HttpRequestDTOBase } from '@app/shared/models';

/** 알림 수정/삭제 요청 DTO */
export class SaveNotificationRequestDTO extends HttpRequestDTOBase {

  /** 알림 ID */
  notificationId?: number;
    
  /** 사용자 ID */
  userId?: number;

}

/** 알림 조회 결과 DTO */
export class NotificationResultDTO {

  /** 알림 ID */
  notificationId?: number;
    
  /** 사용자 ID */
  userId?: number;
    
  /** 알림 제목 */
  notificationTitle?: string;
    
  /** 알림 내용 */
  notiticationContent?: string;
  
  /** 알림 유형 코드 */
  notificationTypeCode?: string;
  
  /** 알림 종류 코드 */
  notificationKindCode?: string;
  
  /** 알림 확인일시 */
  notificationReadDt?: string;
  
  /** 등록일시 */
  createDt?: string;

}

/** 알림 응답 DTO */
export class NotificationResponseDTO {

  /** 알림 */
  notification?: NotificationResultDTO;

  /** 알림 목록 */
  notificationList?: NotificationResultDTO[];

  /** 알림 개수 */
  notificationTotal?: number;

}
