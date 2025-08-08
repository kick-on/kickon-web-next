'use client';

import { Dispatch, RefObject, SetStateAction, useEffect, useRef } from 'react';
import { PlayerAttribute } from '../player';

export default function ControlBar({
	playerRef,
	setPlayerState,
	played,
}: {
	playerRef: RefObject<HTMLVideoElement>;
	setPlayerState: Dispatch<SetStateAction<PlayerAttribute>>;
	played: number;
}) {
	const sliderRef = useRef<HTMLInputElement | null>(null);

	// 재생한 영역(primary-900)을 표시하는 div의 width 설정
	useEffect(() => {
		if (sliderRef.current) {
			sliderRef.current.style.setProperty('--track-width', `calc(${played * 99}% + 2px)`);
		}
	}, [played]);

	const handleSeekMouseDown = () => {
		setPlayerState((prev) => ({ ...prev, seeking: true }));
	};

	const handleSeekChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
		const inputTarget = e.target as HTMLInputElement;
		setPlayerState((prev) => ({ ...prev, played: Number.parseFloat(inputTarget.value) }));
	};

	const handleSeekMouseUp = (e: React.SyntheticEvent<HTMLInputElement>) => {
		const inputTarget = e.target as HTMLInputElement;
		setPlayerState((prev) => ({ ...prev, seeking: false }));

		if (playerRef.current) {
			playerRef.current.currentTime = Number.parseFloat(inputTarget.value) * playerRef.current.duration;
		}
	};

	return (
		<input
			ref={sliderRef}
			type="range"
			min={0}
			max={0.999999}
			step="any"
			value={played}
			onMouseDown={handleSeekMouseDown}
			onTouchStart={handleSeekMouseDown}
			onChange={handleSeekChange}
			onMouseUp={handleSeekMouseUp}
			onTouchEnd={handleSeekMouseUp}
			className="appearance-none absolute z-15 bottom-2 left-0 w-full
        cursor-pointer [&::-webkit-slider-thumb]:appearance-none
        [&::-webkit-slider-thumb]:h-1 [&::-webkit-slider-thumb]:w-1
        [&::-webkit-slider-thumb]:rounded-r-full [&::-webkit-slider-thumb]:bg-primary-900
        [&::-webkit-slider-runnable-track]:h-1
        [&::-webkit-slider-runnable-track]:bg-black-400/40
        before:content-[''] before:absolute before:top-0 before:left-0 before:h-1
        before:w-[var(--track-width)] before:bg-primary-900"
		/>
	);
}
