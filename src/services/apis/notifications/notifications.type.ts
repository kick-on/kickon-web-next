import { SuccessResponse } from '@/services/config/dto';

export interface UnreadNotificationsDto {
	count: number;
}
// 안 읽음 알림 개수 조회 응답
export type GetUnreadNotificationsResponse = SuccessResponse<UnreadNotificationsDto>;

export interface NotificationListItem {
	pk: number;
	type: string;
	content: string;
	redirectUrl: string;
	read: boolean;
	relativeTime: string;
	absoluteTime: string;
}
// 알림 목록 조회 응답
export type GetNotificationListResponse = SuccessResponse<NotificationListItem[]>;
