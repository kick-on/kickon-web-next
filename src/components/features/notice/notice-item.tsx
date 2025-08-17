'use client';

import { useNotificationStore } from '@/lib/store/useNotificationStore';
import { getTimeAgo } from '@/lib/utils/getTimeAgo';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export interface NoticeItemProps {
	pk: number;
	type: string;
	date: string;
	read: boolean;
	redirectUrl: string;
	content: string;
	teamLogo?: string;
}

export default function NoticeItem({ pk, type, date, read, redirectUrl, content, teamLogo }: NoticeItemProps) {
	const router = useRouter();
	const markAsRead = useNotificationStore((state) => state.markAsRead);

	const iconMap: Record<string, string> = {
		match: '/kick/black.svg',
		reply: '/comment.svg',
		prediction: teamLogo ?? '/kick/default.svg',
	};

	const getIconSrc = () => iconMap[type] ?? '/kick/default.svg';

	const typeKorMap: Record<string, string> = {
		match: '경기 일정',
		reply: '답글',
		prediction: '승부 예측',
	};
	const formattedDate = getTimeAgo(date);

	const handleClickNotification = () => {
		if (!read) {
			markAsRead(pk);
		}
		router.push(redirectUrl);
	};

	return (
		<div onClick={handleClickNotification} className="relative flex gap-4 p-4 cursor-pointer hover:bg-black-100">
			<div className="flex items-center justify-center w-8 h-8 rounded-full bg-black-200">
				<Image src={getIconSrc()} alt="알림 출처" width={18} height={18} />
			</div>
			<div className="flex flex-col gap-[5px]">
				<div className="flex text-black-600">
					<span className="mr-[2px] subtitle2-medium">{typeKorMap[type]}</span>
					<span className="mx-2 mt-[1px] leading-none">·</span>
					<span className="body7-regular">{formattedDate}</span>
				</div>
				<span className="body6-regular">{content}</span>
			</div>
			<div className="absolute top-1/2 -translate-y-1/2 right-4">
				<div className="w-[6px] h-[6px] rounded-full bg-negative" />
			</div>
		</div>
	);
}
