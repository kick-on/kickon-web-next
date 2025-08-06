import Preview from '@/components/features/halftime/preview';

export default function TopHalftime() {
	return (
		<div className="grid grid-cols-2 grid-rows-2 gap-2.5">
			{[1, 2, 3, 4].map((i) => (
				<div key={i} className="relative rounded-lg overflow-hidden">
					<div
						className="absolute z-15 bottom-0 w-full p-3 pt-5 text-black-000 body5-medium"
						style={{
							background: `linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, rgba(128, 128, 128, 0.15) 45.22%, rgba(0, 0, 0, 0.30) 100%)`,
						}}
					>
						조회수 2만회
					</div>
					<Preview src={'/video/test1.mp4'} />
				</div>
			))}
		</div>
	);
}
