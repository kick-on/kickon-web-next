import { NotificationItem } from '@/services/apis/notifications/notifications.type';
import { create } from 'zustand';

interface NotificationStore {
	notifications: NotificationItem[];
	unreadCount: number;
	setNotifications: (data: NotificationItem[]) => void;
	addNotification: (data: NotificationItem) => void;
	setUnreadCount: (count: number) => void;
	markAsRead: (id: number) => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
	notifications: [],
	unreadCount: 0,
	setNotifications: (data) => set({ notifications: data }),
	addNotification: (data) =>
		set((state) => {
			// 중복 알림 방지
			if (state.notifications.some((n) => n.pk === data.pk)) {
				return state;
			}
			return {
				notifications: [data, ...state.notifications],
				unreadCount: state.unreadCount + 1,
			};
		}),
	setUnreadCount: (count) => set({ unreadCount: count }),
	markAsRead: (id) =>
		set((state) => {
			const wasUnread = state.notifications.some((n) => n.pk === id && !n.read);
			return {
				notifications: state.notifications.map((n) => (n.pk === id ? { ...n, read: true } : n)),
				unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
			};
		}),
}));
