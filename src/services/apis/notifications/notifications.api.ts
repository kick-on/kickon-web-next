import { fetcher } from '@/lib/server/fetcher';
import { GetNotificationListResponse, GetUnreadNotificationsResponse } from './notifications.type';

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
