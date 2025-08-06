'use client';

import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import TopButtons from './player-action/top-buttons';
import FloatingActionButtons from './player-action/floating-action-buttons';
import PlayButton from './player-action/play-button';
import ControlBar from './player-action/control-bar';

export interface PlayerAttribute {
	playing: boolean;
	seeking: boolean;
	loaded: number;
	played: number;
	loadedSeconds: number;
	playedSeconds: number;
	duration: number;
}

export default function Player({
	src,
	isCurrentPlayer,
	globalMuted,
	toggleGlobalMuted,
}: {
	src: string;
	isCurrentPlayer: boolean;
	globalMuted: boolean;
	toggleGlobalMuted: () => void;
}) {
	const playerRef = useRef(null);
	const [isLoading, setIsLoading] = useState(true);

	const setPlayerRef = useCallback((player: HTMLVideoElement) => {
		if (!player) return;
		playerRef.current = player;
		setIsLoading(false);
	}, []);

	const [playerState, setPlayerState] = useState<PlayerAttribute>({
		playing: isCurrentPlayer,
		seeking: false,
		loaded: 0,
		played: 0,
		loadedSeconds: 0,
		playedSeconds: 0,
		duration: 0,
	});

	// 슬라이드 변경에 따라 playing 초기값 조작
	useEffect(() => {
		setPlayerState((prev) => ({ ...prev, playing: isCurrentPlayer }));
	}, [isCurrentPlayer]);

	// 초기 렌더링 여부에 따라 재생 버튼 조건부 렌더링
	const [isFirstLoad, setIsFirstLoad] = useState(true);

	const togglePlay = () => {
		if (isFirstLoad) {
			setIsFirstLoad(false);
		}
		setPlayerState((prev) => ({ ...prev, playing: !prev.playing }));
	};

	const handleProgress = () => {
		const player = playerRef.current;
		// 재생바 조작 중에는 실행되지 않도록 함
		if (!player || playerState.seeking || !player.buffered?.length) return;

		setPlayerState((prev) => ({
			...prev,
			loadedSeconds: player.buffered?.end(player.buffered?.length - 1),
			loaded: player.buffered?.end(player.buffered?.length - 1) / player.duration,
		}));
	};

	// playerRef의 currentTime이 변경될 때마다 실행되는 이벤트 핸들러
	const handleTimeUpdate = () => {
		const player = playerRef.current;
		// 재생바 조작 중에는 실행되지 않도록 함
		if (!player || playerState.seeking) return;
		if (!player.duration) return;

		setPlayerState((prev) => ({
			...prev,
			playedSeconds: player.currentTime,
			played: player.currentTime / player.duration,
		}));
	};

	// 영상 총 길이 설정
	const handleDurationChange = () => {
		const player = playerRef.current;
		if (!player) return;

		setPlayerState((prev) => ({ ...prev, duration: player.duration }));
	};

	const { playing, played } = playerState;

	return (
		<div className="relative w-full h-full flex items-center justify-center">
			<TopButtons globalMuted={globalMuted} toggleGlobalMuted={toggleGlobalMuted} />
			<FloatingActionButtons />
			{!isFirstLoad && <PlayButton playing={playing} />}

			{typeof window !== 'undefined' && isCurrentPlayer && (
				<ControlBar playerRef={playerRef} setPlayerState={setPlayerState} played={played} />
			)}

			<div
				role="button"
				onClick={togglePlay}
				className={clsx(
					"relative w-full h-full flex items-center justify-center rounded-lg bg-black-300 overflow-hidden before:absolute before:z-10 before:top-0 before:right-0 before:bottom-0 before:left-0 before:content-[''] before:bg-black-150 before:rounded-lg",
					isLoading ? 'before:animate-pulse' : '',
				)}
			>
				<ReactPlayer
					src={src}
					ref={setPlayerRef}
					loop
					muted={globalMuted}
					playing={playing}
					onTimeUpdate={handleTimeUpdate}
					onProgress={handleProgress}
					onDurationChange={handleDurationChange}
					className="react-player relative z-10 w-full! h-full! object-cover pointer-events-none"
					config={{
						youtube: {
							rel: 0,
							fs: 0,
							iv_load_policy: 3,
						},
					}}
				/>
			</div>
		</div>
	);
}
