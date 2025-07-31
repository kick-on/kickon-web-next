'use client';

import useIsDesktop from '@/lib/hooks/useIsDesktop';
import clsx from 'clsx';
import { useState } from 'react';
import ReactPlayer from 'react-player';

export default function Player({ src, index, autoplay }: { src: string; index: number } & Partial<HTMLMediaElement>) {
	const [isPlaying, setIsPlaying] = useState(true);
	const isDesktop = useIsDesktop();

	return (
		<div
			role="button"
			className="relative w-full h-full flex items-center justify-center"
			onClick={() => setIsPlaying(!isPlaying)}
		>
			<div className="absolute z-15 top-4 left-4 right-4 flex justify-between items-center">
				<button className="w-9 h-9 bg-black-900/10 rounded-full"></button>
				<button className="w-9 h-9 bg-black-900/10 rounded-full"></button>
			</div>

			<div
				className={clsx(
					'absolute z-15 py-6 px-4 flex flex-col gap-8 rounded-lg shadow-calendar',
					isDesktop
						? 'bg-black-000/20 border border-black-200 bottom-24 -right-20'
						: 'bg-black-900/10 bottom-8 tablet:right-4 @mobile:right-3',
				)}
			>
				{[1, 2, 3, 4].map((i) => (
					<div key={i} className="w-[1.625rem] h-[2.875rem]"></div>
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
