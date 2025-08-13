'use client';

import NoticeHeader from '@/components/features/notice/notice-header';
import NoticeItem from '@/components/features/notice/notice-item';
import { useNotificationStore } from '@/lib/store/useNotificationStore';

export default function Page() {
	const notifications = useNotificationStore((state) => state.notifications);

	return (
		<div>
			<NoticeHeader />
			{notifications.map((notice) => (
				<NoticeItem key={notice.pk} type={notice.type} date={notice.relativeTime} content={notice.content} />
			))}
		</div>
	);
}
