'use client';

import NoticeHeader from '@/components/features/notice/notice-header';
import NoticeItem from '@/components/features/notice/notice-item';
import { useNotificationStore } from '@/lib/store/useNotificationStore';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

export default function NoticeModal({ onCloseModal }: { onCloseModal: () => void }) {
	const notifications = useNotificationStore((state) => state.notifications);
	const modalRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!modalRef.current) return;

		const handleOutsideClick = (e: MouseEvent) => {
			if (!modalRef.current.contains(e.target as Node)) {
				onCloseModal();
			}
		};

		document.addEventListener('click', handleOutsideClick);
		return () => {
			document.removeEventListener('click', handleOutsideClick);
		};
	}, [modalRef, onCloseModal]);

	return (
		<div
			ref={modalRef}
			className="absolute top-[2.95rem] -right-[1.05rem] w-[20.25rem] h-[630px]
                bg-black-000 border border-black-100 rounded-[0.625rem]
                flex flex-col shadow-navbar-modal z-25"
		>
			<Image
				className="absolute -top-2.5 right-[1.125rem]"
				style={{
					filter: 'drop-shadow(0 -2px 3px rgba(0, 0, 0, 0.05))',
				}}
				width={20}
				height={10}
				src={'/navbar-modal-arrow.svg'}
				alt="화살표"
			/>
			<NoticeHeader isModal={true} onClose={onCloseModal} />
			<div className="flex-1 rounded-b-[0.625rem] overflow-y-auto no-scrollbar">
				{notifications.map((notice) => (
					<NoticeItem
						key={notice.pk}
						pk={notice.pk}
						type={notice.type}
						read={notice.read}
						teamLogo={notice.teamLogo}
						redirectUrl={notice.redirectUrl}
						relativeTime={notice.relativeTime}
						content={notice.content}
						isModal={true}
						onCloseModal={onCloseModal}
					/>
				))}
			</div>
		</div>
	);
}
