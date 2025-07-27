'use client';

export default function Video({ src }: { src: string }) {
	const handleMouseOver = (e: React.MouseEvent) => {
		(e.target as HTMLVideoElement).play();
	};

	const handleMouseLeave = (e: React.MouseEvent) => {
		(e.target as HTMLVideoElement).pause();
		(e.target as HTMLVideoElement).currentTime = 0;
	};

	return (
		<video onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave} muted width="100%" height="100%">
			<source src={src} type="video/mp4" />
			Your browser does not support the video tag.
		</video>
	);
}
