'use client';

import useNotificationSocket from '@/lib/hooks/useNotificationSocket';
import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import { useNotificationStore } from '@/lib/store/useNotificationStore';
import { getNotificationList, getUnreadNotifications } from '@/services/apis/notifications/notifications.api';
import { useEffect } from 'react';

export default function NotificationInitializer() {
	const { currentUserInfo } = useCurrentUserInfoStore();
	const setUnreadCount = useNotificationStore((s) => s.setUnreadCount);
	const setNotifications = useNotificationStore((s) => s.setNotifications);

	useNotificationSocket(currentUserInfo?.id);

	useEffect(() => {
		if (!currentUserInfo?.id) return;

		const fetchInitialData = async () => {
			try {
				const [unread, list] = await Promise.all([getUnreadNotifications(), getNotificationList()]);

				if (unread) setUnreadCount(unread.data.count);
				if (list) setNotifications(list.data);
			} catch (error) {
				console.error('알림 초기 데이터 로딩 실패:', error);
			}
		};

		fetchInitialData();

		// 폴링 (5분마다 unread count 동기화, 장시간 켜져 있어도 서버와 싱크 유지)
		const interval = setInterval(
			async () => {
				try {
					const unread = await getUnreadNotifications();
					if (unread) setUnreadCount(unread.data.count);
				} catch (error) {
					console.error('unread count 폴링 실패:', error);
				}
			},
			5 * 60 * 1000,
		);

		return () => clearInterval(interval);
	}, [currentUserInfo?.id]);

	return null;
}
