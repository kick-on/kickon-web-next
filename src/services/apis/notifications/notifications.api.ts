import { fetcher } from '@/lib/server/fetcher';
import {
	GetNotificationListResponse,
	GetUnreadNotificationsResponse,
	PatchNotificationReadRequest,
} from './notifications.type';
import { EmptySuccessResponse, FailResponse } from '@/services/config/dto';

//읽지 않은 알림 개수 조회
export const getUnreadNotifications = async (): Promise<GetUnreadNotificationsResponse | null> => {
	try {
		const response = await fetcher<GetUnreadNotificationsResponse>({
			method: 'GET',
			url: '/api/notifications/unread-count',
		});

		if (!response) {
			console.error('안 읽은 알림 개수 조회 - 응답 없음');
			throw new Error('안 읽은 알림 개수 조회');
		}

		return response;
	} catch (error) {
		console.error('안 읽은 알림 개수 조회:', error);
		throw error;
	}
};

// 알림 목록 조회
export const getNotificationList = async (): Promise<GetNotificationListResponse | null> => {
	try {
		const response = await fetcher<GetNotificationListResponse>({
			method: 'GET',
			url: '/api/notifications',
		});

		if (!response) {
			console.error('알림 목록 조회 - 응답 없음');
			throw new Error('알림 목록 조회');
		}

		return response;
	} catch (error) {
		console.error('알림 목록 조회:', error);
		throw error;
	}
};

// 알림 읽음 처리
export const patchNotificationRead = async ({ notificationPk }: PatchNotificationReadRequest) => {
	try {
		const response = await fetcher<EmptySuccessResponse | FailResponse>({
			method: 'PATCH',
			url: `/api/notifications/${notificationPk}/read`,
		});

		if (!response.code.split('_').includes('SUCCESS')) {
			console.error(response);
			return response.message;
		}
		return response;
	} catch (error) {
		console.error('알림 읽음 처리 실패: ', error);
	}
};
