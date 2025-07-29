'use client';

import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';

export default function Preview({ src }: { src: string }) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [thumbnailUrl, setThumbnailUrl] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	const playerRef = useRef(null);

	const setPlayerRef = (player) => {
		if (!player) return;
		console.log(typeof player);
		// player.currentTime = 0;
		if (player instanceof HTMLVideoElement) {
			player.currentTime = 0;
			playerRef.current = player;
		} else if (src.includes('youtube') || src.includes('youtu.be')) {
			setYoutubeThumbnail();
		}
	};

	// -------

	function setYoutubeThumbnail() {
		console.log('thumbnail', thumbnailUrl);
		if (thumbnailUrl) return;

		if (src.includes('youtube.com/shorts')) {
			const url = new URL(src);
			const videoId = url.pathname.split('/').at(-1);
			console.log(videoId);

			if (videoId) {
				const youtubeThumbnail = `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;
				setThumbnailUrl(youtubeThumbnail);
				setIsLoading(false);
			}

			return;
		}

		if (src.includes('youtube')) {
			const url = new URL(src);
			const videoId = url.searchParams.get('v');

			if (videoId) {
				const youtubeThumbnail = `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;
				setThumbnailUrl(youtubeThumbnail);
				setIsLoading(false);
			}

			return;
		}

		if (src.includes('youtu.be')) {
			const url = new URL(src);
			const videoId = url.pathname.slice(1);
			console.log(videoId);

			if (videoId) {
				const youtubeThumbnail = `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;
				setThumbnailUrl(youtubeThumbnail);
				setIsLoading(false);
			}

			return;
		}
	}

	useEffect(() => {
		if (playerRef.current) {
			console.log(playerRef.current.currentTime);
			playerRef.current.currentTime = 1; // 0초로 이동
		}
	}, [playerRef]);

	const handleSeeked = () => {
		if (thumbnailUrl) return;

		const videoElement = playerRef.current;
		const canvasElement = canvasRef.current;
		if (!videoElement || !canvasElement) return;

		try {
			const context = canvasElement.getContext('2d');

			// 캔버스 크기를 비디오의 원래 크기와 동일하게 설정
			canvasElement.width = videoElement.videoWidth;
			canvasElement.height = videoElement.videoHeight;

			// 비디오의 현재 프레임을 캔버스에 그립니다.
			context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

			// 캔버스 내용을 이미지 URL로 변환 (JPEG 형식, 품질 0.8)
			const dataUrl = canvasElement.toDataURL('image/jpeg', 0.8);
			setThumbnailUrl(dataUrl);
			setIsLoading(false);
			setError(null);
		} catch (err) {
			console.error('Failed to capture thumbnail:', err);
			setError('썸네일 캡처에 실패했습니다.');
			setIsLoading(false);
		}
	};

	// 임베드된 영상은 적용 안 됨 (ref 설정 안 되는 문제)
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
			className="relative w-full h-full flex items-center justify-center"
		>
			<ReactPlayer
				src={src}
				ref={setPlayerRef}
				muted
				className="react-player relative z-10 w-auto! h-full! aspect-[13/20]! object-cover"
				onTimeUpdate={handleSeeked}
				config={{
					youtube: {
						end: 10,
						rel: 0,
						fs: 0,
						iv_load_policy: 3,
					},
				}}
			/>
			{/* 과거 로직, 추후 삭제 */}
			{/* <video ref={playerRef} muted className="relative z-10 w-full hidden">
				<source src={src} type="video/mp4" />
				Your browser does not support the video tag.
			</video> */}
			<canvas ref={canvasRef} style={{ display: 'none' }} />

			{/* 상하 여백이 남을 때 백그라운드에 렌더링하는 블러 처리된 썸네일 */}
			{/* <div
				className="absolute z-5 w-[120%] h-[120%] top-1/2 left-1/2 -translate-1/2 bg-no-repeat bg-cover bg-center opacity-70"
				style={{ backgroundImage: `url(${thumbnailUrl})`, filter: 'blur(20px)' }}
			/> */}
			<div
				className={clsx('absolute w-full h-full bg-black-300', {
					"z-15 before:content-[''] before:absolute before:z-15 before:top-0 before:right-0 before:bottom-0 before:left-0 before:bg-black-150 before:animate-pulse":
						isLoading,
				})}
			/>
		</div>
	);
}
