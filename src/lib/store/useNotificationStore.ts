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

export const useNotificationStore = create<NotificationStore>((set) => ({
	notifications: [],
	unreadCount: 0,
	setNotifications: (data) => set({ notifications: data }),
	addNotification: (data) =>
		set((state) => ({
			notifications: [data, ...state.notifications],
			unreadCount: state.unreadCount + 1,
		})),
	setUnreadCount: (count) => set({ unreadCount: count }),
	markAsRead: (id) =>
		set((state) => ({
			notifications: state.notifications.map((n) => (n.pk === id ? { ...n, read: true } : n)),
			unreadCount: state.unreadCount - 1,
		})),
}));
