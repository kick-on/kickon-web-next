'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
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
	const router = useRouter();

	const playerRef = useRef(null);
	const isS3Video = playerRef.current instanceof HTMLVideoElement;
	const [isLoading, setIsLoading] = useState(true);

	const setPlayerRef = useCallback((player: HTMLVideoElement) => {
		if (!player) return;
		playerRef.current = player;
		setIsLoading(false);
	}, []);

	const [playerState, setPlayerState] = useState({
		playing: isCurrentPlayer,
		seeking: false,
		loaded: 0,
		played: 0,
		loadedSeconds: 0,
		playedSeconds: 0,
		duration: 0,
	});

	// 재생 및 정지
	const [isFirstLoad, setIsFirstLoad] = useState(true);

	const togglePlay = () => {
		if (isFirstLoad) {
			// 영상 초기 렌더링 시에 매번 정지 버튼이 나타나지 않도록
			// 초기 렌더링 여부에 따라 정지 버튼 조건부 렌더링
			setIsFirstLoad(false);
		}
		setPlayerState((prev) => ({ ...prev, playing: !prev.playing }));
	};

	// handleSeek* - 재생바 조작 관련 이벤트 핸들러
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
		console.log('mouse up');
		if (playerRef.current) {
			playerRef.current.currentTime = Number.parseFloat(inputTarget.value) * playerRef.current.duration;
		}
	};

	const handleProgress = () => {
		const player = playerRef.current;
		// 재생바 조작 중에는 실행되지 않도록 함
		if (!player || playerState.seeking || !player.buffered?.length) return;

		console.log('onProgress');

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

	// 슬라이드 변경에 따라 playing 초기값 조작
	useEffect(() => {
		setPlayerState((prev) => ({ ...prev, playing: isCurrentPlayer }));
	}, [isCurrentPlayer]);

	// 재생된 영역(primary-900) 커스텀 로직
	const sliderRef = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		if (sliderRef.current) {
			sliderRef.current.style.setProperty('--track-width', `${playerState.played * 100}%`);
		}
	}, [playerState.played]);

	const { playing, played } = playerState;

	return (
		<div className="relative w-full h-full flex items-center justify-center">
			{/* 상단 액션 버튼 */}
			<div className="absolute z-15 top-4 left-4 right-4 flex justify-between items-center">
				<button onClick={() => router.back()} className="w-9 h-9 p-1.5 bg-black-900/10 rounded-full">
					<Image src={'/chevron/right-white.svg'} alt="뒤로가기" width={24} height={24} className="rotate-180" />
				</button>
				<button onClick={toggleGlobalMuted} className="w-9 h-9 p-1.5 bg-black-900/10 rounded-full">
					<Image
						src={globalMuted ? '/mute.svg' : '/volume.svg'}
						alt={globalMuted ? '소리' : '음소거'}
						width={24}
						height={24}
					/>
				</button>
			</div>

			{/* 하단 액션 버튼 */}
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

			{/* 재생 버튼 */}
			{!isFirstLoad && (
				<div
					className={`w-18 h-18 flex items-center justify-center pointer-events-none
					absolute z-15 top-1/2 left-1/2 -translate-1/2 rounded-full bg-black-900/30
					${playing ? 'animate-pulse-scale-out' : 'animate-pulse-scale-in'}`}
				>
					<Image src={'/play.svg'} alt="재생" width={36} height={36} />
				</div>
			)}

			{/* 재생바 */}
			{typeof window !== 'undefined' && isS3Video && isCurrentPlayer && (
				<input
					ref={sliderRef}
					type="range"
					min={0}
					max={0.999999}
					step="any"
					value={played}
					onMouseDown={handleSeekMouseDown}
					onChange={handleSeekChange}
					onMouseUp={handleSeekMouseUp}
					onTouchStart={handleSeekMouseDown}
					onTouchEnd={handleSeekMouseUp}
					className="appearance-none absolute z-15 bottom-2 left-0 w-full
						cursor-pointer [&::-webkit-slider-thumb]:appearance-none
						[&::-webkit-slider-thumb]:h-1 [&::-webkit-slider-thumb]:w-2 
						[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-900
						[&::-webkit-slider-runnable-track]:h-1
						[&::-webkit-slider-runnable-track]:bg-black-400/40
						before:content-[''] before:absolute before:top-0 before:left-0 before:h-1
						before:w-[var(--track-width)] before:bg-primary-900 before:rounded-r-full"
				/>
			)}

			{/* 플레이어 */}
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

				{/* 백그라운드(스켈레톤) */}
				{!playerRef.current && (
					<div
						className="absolute top-0 left-0 w-full h-full bg-black-300 rounded-lg
						before:absolute before:z-15 before:top-0 before:right-0 before:bottom-0 before:left-0
						before:content-[''] before:bg-black-150 before:rounded-lg before:animate-pulse"
					/>
				)}
			</div>
		</div>
	);
}
