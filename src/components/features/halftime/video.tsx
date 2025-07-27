'use client';

import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

export default function Video({ src }: { src: string }) {
	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [thumbnailUrl, setThumbnailUrl] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const videoElement = videoRef.current;
		const canvasElement = canvasRef.current;

		if (!videoElement || !canvasElement) {
			return;
		}

		const captureThumbnail = () => {
			// 비디오의 현재 시간을 0으로 설정 (첫 프레임)
			videoElement.currentTime = 0;

			// seeked 이벤트는 currentTime이 성공적으로 이동했을 때 발생합니다.
			const handleSeeked = () => {
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

					// 더 이상 필요 없으므로 이벤트 리스너 제거
					videoElement.removeEventListener('seeked', handleSeeked);
				} catch (err) {
					console.error('Failed to capture thumbnail:', err);
					setError('썸네일 캡처에 실패했습니다.');
					setIsLoading(false);
				}
			};

			// 비디오 메타데이터가 로드되면 썸네일 캡처 시도
			const handleLoadedMetadata = () => {
				videoElement.addEventListener('seeked', handleSeeked);
				// currentTime을 0으로 설정하여 seeked 이벤트 트리거
				videoElement.currentTime = 0;
			};

			// 비디오가 충분히 로드되어 재생 가능할 때 (메타데이터 포함)
			videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);

			// 비디오 로드 오류 처리
			const handleError = () => {
				setError('비디오를 로드할 수 없습니다.');
				setIsLoading(false);
			};
			videoElement.addEventListener('error', handleError);

			// 클린업 함수
			return () => {
				videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
				videoElement.removeEventListener('seeked', handleSeeked);
				videoElement.removeEventListener('error', handleError);
			};
		};

		// 비디오 로드 시작
		videoElement.load();
		captureThumbnail();
	}, [src]);

	const handleMouseOver = () => {
		videoRef.current.play();
	};

	const handleMouseLeave = () => {
		videoRef.current.pause();
		videoRef.current.currentTime = 0;
	};

	return (
		<div
			onMouseOver={handleMouseOver}
			onMouseLeave={handleMouseLeave}
			className="relative w-full h-full flex items-center justify-center"
		>
			<video ref={videoRef} muted className="relative z-10 w-full">
				<source src={src} type="video/mp4" />
				Your browser does not support the video tag.
			</video>
			<canvas ref={canvasRef} style={{ display: 'none' }} /> {/* 캔버스도 숨김 */}
			<div
				className="absolute z-5 w-[120%] h-[120%] top-1/2 left-1/2 -translate-1/2 bg-no-repeat bg-cover bg-center opacity-70"
				style={{ backgroundImage: `url(${thumbnailUrl})`, filter: 'blur(20px)' }}
			/>
			<div
				className={clsx(
					'absolute w-full h-full',
					isLoading
						? "bg-black-300 z-15 before:content-[''] before:absolute before:z-15 before:top-0 before:right-0 before:bottom-0 before:left-0 before:bg-black-200 before:animate-pulse"
						: 'bg-black-700',
				)}
			/>
		</div>
	);
}
