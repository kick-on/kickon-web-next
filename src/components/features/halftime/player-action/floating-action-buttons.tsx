'use client';

import { useViewedHalftimesStore } from '@/lib/store/useHalftimeStore';
import { formatNumberByUnit } from '@/lib/utils';
import { createBoardKick } from '@/services/apis/board/board.api';
import { createNewsKick } from '@/services/apis/news/news.api';
import { GetHalftimeDetailDto } from '@/services/apis/shorts/shorts.type';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { memo, useState } from 'react';
import { KickIcon, CommentIcon, ShareIcon, PaperIcon } from './icon';
import CommentSection from './comment-section/comment-section';

interface ActionButton {
	label: '킥' | '공유' | '본문' | '댓글';
	value: string | number;
	icon: React.ReactNode;
}

function FloatingActionButtons({
	isKicked: isKickedData,
	kickCount: kickCountData,
	replyCount: replyCountData,
	usedIn,
	referencePk,
}: Pick<GetHalftimeDetailDto, 'isKicked' | 'kickCount' | 'replyCount' | 'usedIn' | 'referencePk'>) {
	const router = useRouter();

	const [isKicked, setIsKicked] = useState(isKickedData);
	const [kickCount, setKickCount] = useState(kickCountData);

	const [isHalftimeCommentOpen, setIsHalftimeCommentOpen] = useState(false);
	const { toggleIsKicked } = useViewedHalftimesStore();

	const actionButtons: ActionButton[] = [
		{
			label: '킥',
			value: formatNumberByUnit(kickCount),
			icon: <KickIcon isKicked={isKicked} />,
		},
		{
			label: '댓글',
			value: formatNumberByUnit(replyCountData),
			icon: <CommentIcon />,
		},
		{
			label: '공유',
			value: '공유',
			icon: <ShareIcon />,
		},
		{
			label: '본문',
			value: '본문',
			icon: <PaperIcon />,
		},
	];

	const handleClick = (label: (typeof actionButtons)[number]['label']) => {
		switch (label) {
			case '킥':
				toggleKick();
				break;
			case '댓글':
				setIsHalftimeCommentOpen(!isHalftimeCommentOpen);
				break;
			case '공유':
				copyUrlToClipboard();
				break;
			case '본문':
				const type = usedIn.toLocaleLowerCase();
				router.push(`/${type}/${referencePk}`);
				break;
		}
	};

	const toggleKick = async () => {
		const isNews = usedIn === 'NEWS';

		try {
			if (isNews) {
				await createNewsKick(referencePk);
			} else {
				await createBoardKick(referencePk);
			}

			setKickCount(isKicked ? kickCount - 1 : kickCount + 1);
			setIsKicked(!isKicked);
			toggleIsKicked(referencePk);
		} catch {
			alert('킥 처리 중 문제가 발생했습니다.');
		}
	};

	const copyUrlToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(window.location.href);
			alert('URL이 복사되었어요.');
		} catch (err) {
			console.error(err);
			alert('URL 복사에 실패했습니다.');
		}
	};

	return (
		<>
			<div
				className="absolute z-20 py-6 px-3 flex flex-col gap-8 rounded-lg shadow-calendar
				desktop:border desktop:border-black-200
				desktop:bg-black-000/20 desktop:bottom-0 desktop:-right-20
				bg-black-900/10 bottom-8 tablet:right-4 @mobile:right-3"
			>
				{actionButtons.map((button) => (
					<button
						key={button.label}
						onClick={() => handleClick(button.label)}
						className={clsx(
							'px-1 flex flex-col gap-1.5 items-center body7-medium text-black-000 desktop:text-black-900 hover:text-black-400',
						)}
					>
						{button.icon}
						<span>{button.value}</span>
					</button>
				))}
				{isHalftimeCommentOpen && <CommentSection onClose={() => setIsHalftimeCommentOpen(false)} />}
			</div>
		</>
	);
}

export default memo(FloatingActionButtons);
