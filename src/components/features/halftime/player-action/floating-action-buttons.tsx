'use client';

import Image from 'next/image';

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
	{
		label: '공유',
		value: '공유',
		src: '/share.svg',
	},
	{
		label: '본문',
		value: '본문',
		src: '/paper.svg',
	},
];

export default function FloatingActionButtons() {
	return (
		<div
			className="absolute z-15 py-6 px-3 flex flex-col gap-8 rounded-lg shadow-calendar
    desktop:border desktop:border-black-200
    desktop:bg-black-000/20 desktop:bottom-0 desktop:-right-20
    bg-black-900/10 bottom-8 tablet:right-4 @mobile:right-3"
		>
			{actionButtons.map((button) => (
				<button
					key={button.src}
					className="px-2 flex flex-col gap-1.5 items-center body7-medium text-black-600
        tablet:brightness-0 tablet:invert @mobile:brightness-0 @mobile:invert"
				>
					<Image src={button.src} alt={button.label} width={24} height={24} />
					<span>{button.value || '1.2천'}</span>
				</button>
			))}
		</div>
	);
}
