'use client';

import clsx from 'clsx';
import { useRef, useState } from 'react';
import ReactPlayer from 'react-player';

export default function Preview({ src }: { src: string }) {
	const [isLoading, setIsLoading] = useState(true);
	const playerRef = useRef(null);

	const setPlayerRef = (player: HTMLVideoElement) => {
		if (!player) return;
		player.currentTime = 0;
		playerRef.current = player;
		setIsLoading(false);
	};

	// 호버 시 재생
	const handleMouseOver = () => {
		if (!playerRef.current) return;
		playerRef.current.play();
	};

	const handleMouseLeave = () => {
		if (!playerRef.current) return;
		playerRef.current.pause();
		playerRef.current.currentTime = 0;
	};

	return (
		<div
			onMouseOver={handleMouseOver}
			onMouseLeave={handleMouseLeave}
			className={clsx(
				"relative w-full h-full flex items-center justify-center bg-black-300 before:absolute before:z-10 before:top-0 before:right-0 before:bottom-0 before:left-0 before:content-[''] before:bg-black-150 before:rounded-lg",
				isLoading ? 'before:animate-pulse' : '',
			)}
		>
			<ReactPlayer
				src={src}
				ref={setPlayerRef}
				muted
				className="react-player relative z-10 w-full! h-full! object-cover pointer-events-none"
				config={{
					youtube: {
						end: 10,
						rel: 0,
						fs: 0,
						iv_load_policy: 3,
					},
				}}
			/>
		</div>
	);
}
