import Image from 'next/image';
import { memo } from 'react';

function PlayButton({ playing }: { playing: boolean }) {
	return (
		<div
			className={`w-18 h-18 flex items-center justify-center pointer-events-none
      absolute z-15 top-1/2 left-1/2 -translate-1/2 rounded-full bg-black-900/30
      ${playing ? 'animate-pulse-scale-out' : 'animate-pulse-scale-in'}`}
		>
			<Image src={'/play.svg'} alt="재생" width={36} height={36} />
		</div>
	);
}

export default memo(PlayButton);
