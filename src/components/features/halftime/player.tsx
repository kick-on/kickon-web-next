'use client';

import clsx from 'clsx';
import { useState } from 'react';
import ReactPlayer from 'react-player';

export default function Player({ src, index, autoplay }: { src: string; index: number } & Partial<HTMLMediaElement>) {
	const [isPlaying, setIsPlaying] = useState(true);

	return (
		<div
			role="button"
			className="relative w-full h-full flex items-center justify-center"
			onClick={() => setIsPlaying(!isPlaying)}
		>
			<ReactPlayer
				src={src}
				loop
				muted={index === 1}
				playing={autoplay && isPlaying}
				className="react-player relative z-10 w-auto! h-full! aspect-[13/20]! object-cover pointer-events-none"
				config={{
					youtube: {
						rel: 0,
						fs: 0,
						iv_load_policy: 3,
					},
				}}
			/>
			<div
				className={clsx('absolute w-full h-full bg-black-300', {
					"z-15 before:content-[''] before:absolute before:z-15 before:top-0 before:right-0 before:bottom-0 before:left-0 before:bg-black-150 before:animate-pulse":
						false,
				})}
			/>
		</div>
	);
}
