'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface NoticeHeaderProps {
	isModal?: boolean;
	onClose?: () => void;
}

export default function NoticeHeader({ isModal = false, onClose }: NoticeHeaderProps) {
	const router = useRouter();

	return (
		<div
			className={clsx(
				'relative flex justify-center overflow-none items-center rounded-t-[0.625rem] border-b border-black-200 bg-white',
				isModal ? 'py-5' : 'py-6',
			)}
		>
			{!isModal && (
				<button
					onClick={() => router.back()}
					className="absolute left-4 top-1/2 -translate-y-1/2"
					aria-label="뒤로가기"
				>
					<Image src="/chevron/calendar-left.svg" alt="" width={24} height={24} />
				</button>
			)}

			<span className="header-medium">알림</span>

			{isModal && onClose && (
				<button onClick={onClose} className="absolute right-4 top-1/2 -translate-y-1/2" aria-label="닫기">
					<Image src="/x/black.svg" alt="" width={24} height={24} />
				</button>
			)}
		</div>
	);
}
