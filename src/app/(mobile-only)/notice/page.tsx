'use client';

import NoticeHeader from '@/components/features/notice/notice-header';
import NoticeItem from '@/components/features/notice/notice-item';
import { dummyNotices } from '@/lib/constants/dummyNotices';

export default function Page() {
	return (
		<div>
			<NoticeHeader />
			{dummyNotices.map((notice) => (
				<NoticeItem
					key={notice.id}
					type={notice.type}
					date={notice.date}
					content={notice.content}
					teamLogo={notice.teamLogo}
				/>
			))}
		</div>
	);
}
