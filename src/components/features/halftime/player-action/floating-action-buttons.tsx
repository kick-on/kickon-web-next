'use client';

import { useViewedHalftimesStore } from '@/lib/store/useHalftimeStore';
import { formatNumberByUnit } from '@/lib/utils/number/formatNumberByUnit';
import { createBoardKick } from '@/services/apis/board/board.api';
import { createNewsKick } from '@/services/apis/news/news.api';
import { GetHalftimeDetailDto } from '@/services/apis/shorts/shorts.type';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { memo, useState } from 'react';

const actionButtons = [
	{
		label: '킥',
		value: '',
		src: '/kick/fill-none.svg',
	},
	// {
	// 	label: '댓글',
	//	value:'',
	// 	src: '/comment.svg',
	// },
	// {
	// 	label: '공유',
	// 	value: '공유',
	// 	src: '/share.svg',
	// },
	{
		label: '본문',
		value: '본문',
		src: '/paper.svg',
	},
] as const;

type ActionButtonLabel = (typeof actionButtons)[number]['label'];

function FloatingActionButtons({
	isKicked: isKickedData,
	kickCount: kickCountData,
	usedIn,
	referencePk,
}: Pick<GetHalftimeDetailDto, 'isKicked' | 'kickCount' | 'usedIn' | 'referencePk'>) {
	const router = useRouter();
	const [isKicked, setIsKicked] = useState(isKickedData);
	const [kickCount, setKickCount] = useState(kickCountData);
	const { toggleIsKicked } = useViewedHalftimesStore();

	const handleClick = (label: ActionButtonLabel) => {
		switch (label) {
			case '킥':
				toggleKick();
				break;
			// case '공유':
			// 	copyUrlToClipboard();
			// 	break;
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

	// const copyUrlToClipboard = async () => {};

	return (
		<div
			className="absolute z-20 py-6 px-3 flex flex-col gap-8 rounded-lg shadow-calendar
				desktop:border desktop:border-black-200
				desktop:bg-black-000/20 desktop:bottom-0 desktop:-right-20
				bg-black-900/10 bottom-8 tablet:right-4 @mobile:right-3"
		>
			{actionButtons.map((button) => (
				<button
					key={button.src}
					onClick={() => handleClick(button.label)}
					className="px-2 flex flex-col gap-1.5 items-center body7-medium text-black-600
						tablet:brightness-0 tablet:invert @mobile:brightness-0 @mobile:invert"
				>
					<Image src={button.src} alt={button.label} width={24} height={24} />
					<span>{button.value || formatNumberByUnit(kickCount)}</span>
				</button>
			))}
		</div>
	);
}

export default memo(FloatingActionButtons);
