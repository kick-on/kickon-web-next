import Image from 'next/image';

export default function Selectbox({ category, options }) {
	const selectedOption = options[0].league;
	return (
		<div className="flex flex-col gap-2">
			<div className="subtitle1-medium">{category}</div>
			<button className="px-4 py-3 flex items-center border border-black-300 rounded-lg body3-regular">
				<Image width={18} height={18} src="/league-logo/premier-league.svg" alt="프리미어 리그" />
				<div className="ml-2.5 mr-auto">{selectedOption}</div>
				<Image width={18} height={18} src="/chevron/down.svg" alt="리그 선택" />
			</button>
		</div>
	);
}
