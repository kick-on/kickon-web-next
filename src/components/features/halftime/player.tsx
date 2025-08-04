'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
	const [playerState, setPlayerState] = useState<{ playing: boolean }>({
		playing: isCurrentPlayer,
	});

	const router = useRouter();

	const togglePlay = () => {
		setPlayerState({ ...playerState, playing: !playerState.playing });
	};

	useEffect(() => {
		setPlayerState((prev) => ({ ...prev, playing: isCurrentPlayer }));
	}, [isCurrentPlayer]);

	const { playing } = playerState;

	return (
		<div className="relative w-full h-full flex items-center justify-center">
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

			<div role="button" onClick={togglePlay} className="w-full h-full rounded-lg overflow-hidden">
				<ReactPlayer
					src={src}
					loop
					muted={globalMuted}
					playing={playing}
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
