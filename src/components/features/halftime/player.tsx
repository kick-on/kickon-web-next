'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { useState } from 'react';
import ReactPlayer from 'react-player';

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

export default function Player({ src, index, autoplay }: { src: string; index: number } & Partial<HTMLMediaElement>) {
	const [isPlaying, setIsPlaying] = useState(true);
	const [isMuted, setIsMuted] = useState(true);

	return (
		<div
			role="button"
			className="relative w-full h-full flex items-center justify-center"
			onClick={() => setIsPlaying(!isPlaying)}
		>
			<div className="absolute z-15 top-4 left-4 right-4 flex justify-between items-center">
				<button className="w-9 h-9 p-1.5 bg-black-900/10 rounded-full">
					<Image src={'/chevron/right-white.svg'} alt="뒤로가기" width={24} height={24} className="rotate-180" />
				</button>
				<button className="w-9 h-9 p-1.5 bg-black-900/10 rounded-full" onClick={() => setIsMuted(!isMuted)}>
					<Image src={isMuted ? '/mute.svg' : '/volume.svg'} alt={isMuted ? '소리' : '음소거'} width={24} height={24} />
				</button>
			</div>

			<div
				className="absolute z-15 py-6 px-3 flex flex-col gap-8 rounded-lg shadow-calendar
					desktop:border desktop:border-black-200
					desktop:bg-black-000/20 desktop:bottom-24 desktop:-right-20
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

			<div className="w-full h-full rounded-lg overflow-hidden">
				<ReactPlayer
					src={src}
					loop
					muted={index === 1}
					playing={autoplay && isPlaying}
					className="react-player relative z-10 w-full! h-full! aspect-[13/20]! object-cover pointer-events-none"
					config={{
						youtube: {
							rel: 0,
							fs: 0,
							iv_load_policy: 3,
						},
					}}
				/>
			</div>
			<div
				className={clsx('absolute w-full h-full bg-black-300 rounded-lg', {
					"z-15 before:content-[''] before:absolute before:z-15 before:top-0 before:right-0 before:bottom-0 before:left-0 before:bg-black-150 before:rounded-lg before:animate-pulse":
						false,
				})}
			/>
		</div>
	);
}
