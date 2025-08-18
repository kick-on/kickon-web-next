'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import TopButtons from './player-action/top-buttons';

export default function VideoFetchFailed() {
	const router = useRouter();

	const handleButtonClick = () => {
		router.refresh();
	};

	return (
		<div className="w-full h-full flex flex-col items-center justify-center text-black-000 bg-black-900 rounded-lg">
			<TopButtons />

			<div className="text-title-03 mb-[1.125rem]">동영상을 불러오지 못했어요.</div>
			<div className="text-body-05 mb-8">다시 시도해 주세요.</div>
			<button onClick={handleButtonClick} className="p-[1.125rem] bg-black-000/20 rounded-full">
				<Image src={'/rotate.svg'} alt="" width={36} height={36} />
			</button>
		</div>
	);
}
