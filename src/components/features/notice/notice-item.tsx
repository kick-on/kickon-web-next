'use client';

import { useNotificationStore } from '@/lib/store/useNotificationStore';
import { patchNotificationRead } from '@/services/apis/notifications/notifications.api';
import { NotificationItem } from '@/services/apis/notifications/notifications.type';
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type NormalizedType = 'result' | 'comment' | 'reminder' | 'default';

const normalizeType = (rawType: string): NormalizedType => {
	if (rawType.includes('REPLY')) return 'comment';
	if (rawType === 'GAME_RESULT') return 'result';
	if (rawType.startsWith('GAME_REMINDER')) return 'reminder';

	return 'default';
};

export interface NoticeItemProps extends NotificationItem {
	isModal?: boolean;
	onCloseModal?: () => void;
}
export default function NoticeItem({
	pk,
	type,
	relativeTime,
	read,
	redirectUrl,
	content,
	teamLogo,
	isModal = false,
	onCloseModal,
}: NoticeItemProps) {
	const router = useRouter();
	const markAsRead = useNotificationStore((state) => state.markAsRead);

	const typeMap: Record<NormalizedType, { icon: string; label: string }> = {
		result: {
			icon: teamLogo ?? '/kick/default.svg',
			label: '승부 예측',
		},
		comment: {
			icon: '/comment.svg',
			label: '답글',
		},
		reminder: {
			icon: '/kick/black.svg',
			label: '경기 일정',
		},
		default: {
			icon: '/kick/default.svg',
			label: '알림',
		},
	};

	const handleClickNotification = async () => {
		if (!read) {
			try {
				await patchNotificationRead({ notificationPk: pk });
				markAsRead(pk);
			} catch (e) {
				console.error('알림 읽음 API 실패', e);
			}
		}
		router.push(redirectUrl);
		if (isModal && onCloseModal) {
			onCloseModal();
		}
	};

	return (
		<div
			onClick={handleClickNotification}
			className={clsx(
				'relative flex gap-4 p-4 cursor-pointer hover:bg-black-100',
				read ? 'bg-black-100' : 'bg-black-000',
			)}
		>
			<div className="flex items-center justify-center w-8 h-8 rounded-full bg-black-200">
				<Image src={typeMap[normalizeType(type)].icon} alt="알림 출처" width={18} height={18} />
			</div>
			<div className="flex flex-col gap-[5px]">
				<div className="flex text-black-600">
					<span className="mr-[2px] subtitle2-medium">{typeMap[normalizeType(type)].label}</span>
					<span className="mx-2 mt-[1px] leading-none">·</span>
					<span className="body7-regular">{relativeTime}</span>
				</div>
				<span className="body6-regular">{content}</span>
			</div>
			{!read && <div className="w-[6px] h-[6px] rounded-full bg-negative self-center ml-auto" />}
		</div>
	);
}
