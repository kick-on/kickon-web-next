'use client';

import { getTimeAgo } from '@/lib/utils/getTimeAgo';
import Image from 'next/image';

// 나중에는 notice:(notice 응답 타입)으로 한 번에 전달하고 파싱해서 사용하기
// 안 읽음 표시 이상함 다시
export interface NoticeItemProps {
	type: string;
	date: string;
	content: string;
	teamLogo?: string;
}

export default function NoticeItem({ type, date, content, teamLogo }: NoticeItemProps) {
	const iconMap: Record<string, string> = {
		match: '/kick/black.svg',
		reply: '/notice-comment.svg',
		prediction: teamLogo ?? '/kick/default.svg',
	};

	const getIconSrc = () => iconMap[type] ?? '/kick/default.svg';

	const typeKorMap: Record<string, string> = {
		match: '경기 일정',
		reply: '답글',
		prediction: '승부 예측',
	};
	const formattedDate = getTimeAgo(date);

	return (
		<div className="relative flex gap-4 p-4">
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
			<div className="absolute right-4 flex items-center">
				<Image src="/notice-unread.svg" alt="안 읽음 표시" width={6} height={6} />
			</div>
		</div>
	);
}
