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
	}, [currentUserInfo?.id]);

	return null;
}
