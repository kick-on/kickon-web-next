'use client';

import { dummyNotices } from '@/app/notice/page';
import NoticeHeader from '@/components/features/notice/notice-header';
import NoticeItem from '@/components/features/notice/notice-item';
import Image from 'next/image';

// TODO: 알림을 확인한 후 bg 컬러 변경
export default function NoticeModal({ onCloseModal }: { onCloseModal: () => void }) {
	return (
		<div
			className="absolute top-[2.7rem] -right-[1.05rem] w-[20.25rem] h-[39.375rem] 
                            bg-black-000 border border-black-100 rounded-[0.625rem]
                            flex flex-col shadow-profile-modal"
		>
			<Image
				className="absolute -top-2.5 right-[1.125rem]"
				style={{
					filter: 'drop-shadow(0 -2px 3px rgba(0, 0, 0, 0.05))',
				}}
				width={20}
				height={10}
				src={'/profile-modal-arrow.svg'}
				alt="화살표"
			/>
			<NoticeHeader isModal={true} onClose={onCloseModal} />
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
