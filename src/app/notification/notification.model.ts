import { HttpRequestDTOBase } from '@app/shared/models';

/** 알림 수정 요청 DTO */
export class UpdateNotificationRequestDTO extends HttpRequestDTOBase {

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
  
  /** 알림 확인일시 */
  notificationReadDt?: string;

}

/** 알림 응답 DTO */
export class NotificationResponseDTO {

  /** 알림 개수 */
  total?: number;

  /** 알림 목록 */
  list?: NotificationResultDTO[];

}
