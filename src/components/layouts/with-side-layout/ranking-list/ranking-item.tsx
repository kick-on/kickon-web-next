import Image from 'next/image';

export default function RankingItem({ mode }: { mode: 'season' | 'predict' }) {
	return (
		<div className="flex justify-between h-9 body6-medium items-center">
			<div className="flex gap-2.5">
				<div className="flex justify-center items-center w-7">1</div>
				<Image width={18} height={18} src="/team-logo/ulsan.svg" alt="울산" />
				<div>울산</div>
			</div>
			<div className="flex gap-2">
				{mode === 'season' ? (
					<>
						<div className="text-center w-7">38</div>
						<div className="text-center w-7">72</div>
						<div className="text-center w-7">62</div>
					</>
				) : (
					<>
						<div className="w-7 text-center">38</div>
						<div className="w-12 text-center">62.24</div>
					</>
				)}
			</div>
		</div>
	);
}
