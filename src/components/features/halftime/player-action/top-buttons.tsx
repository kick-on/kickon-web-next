'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { memo } from 'react';

function TopButtons({ globalMuted, toggleGlobalMuted }: { globalMuted: boolean; toggleGlobalMuted: () => void }) {
	const router = useRouter();

	return (
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
	);
}

export default memo(TopButtons);
