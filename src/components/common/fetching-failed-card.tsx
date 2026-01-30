'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import RotateIcon from '@/assets/common/rotate.svg';

export default function FetchingFailedCard({
	height,
	marginTop,
	onClick,
	isCardVisible = true,
}: {
	height: string;
	marginTop: string;
	onClick?: () => void;
	isCardVisible?: boolean;
}) {
	const router = useRouter();

	const handleRefreshButtonClick = () => {
		if (onClick === undefined) {
			router.refresh();
		} else {
			onClick();
		}
	};

	return (
		<div className="flex flex-col items-center" style={{ height }}>
			{isCardVisible && <Image style={{ marginTop }} width={100} height={100} src={'/x/card.svg'} alt="" />}
			<div className="mt-7 mb-6 @mobile:mt-8 @mobile:mb-3 title4-semibold @mobile:text-14">
				데이터를 불러오지 못했어요.
			</div>
			<button
				onClick={handleRefreshButtonClick}
				className="flex gap-1.5 px-5 py-[0.6875rem] rounded-full bg-black-900
					text-black-000 button4-medium shadow-kick-button
					@mobile:text-10 @mobile:py-2"
			>
				<RotateIcon aria-hidden={true} width={12} height={12} />
				다시 불러오기
			</button>
		</div>
	);
}
