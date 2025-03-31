import Image from 'next/image';

export default function FetchingFailedCard({
	height,
	marginTop,
	onClick,
}: {
	height: string;
	marginTop: string;
	onClick: () => void;
}) {
	return (
		<div className="flex flex-col items-center" style={{ height }}>
			<Image style={{ marginTop }} width={100} height={100} src={'/x-card.svg'} alt="정보 불러오기 실패" />
			<div className="mt-7 mb-6 title4-semibold">데이터를 불러오지 못했어요.</div>
			<button
				onClick={onClick}
				className="flex gap-1.5 px-5 py-[0.6875rem] rounded-full bg-black-900
					text-black-000 button4-medium shadow-kick-button"
			>
				<Image width={12} height={12} src={'/rotate.svg'} alt="새로고침 이미지" />
				다시 불러오기
			</button>
		</div>
	);
}
