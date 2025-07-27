import ComponentFrame from '@/components/common/component-frame';

export default function Page() {
	return (
		<ComponentFrame className="@mobile:w-full! max-[1440px]:w-[80%]! w-[90%]! max-w-[1360px] m-auto mt-4 @mobile:mt-0 @mobile:bg-transparent @mobile:border-0">
			<div
				className="grid py-6
					max-[1440px]:px-4 max-[1440px]:grid-cols-4 max-[1440px]:gap-x-3
					max-[1094px]:px-4 max-[1094px]:grid-cols-3 max-[1094px]:gap-x-3
					@mobile:px-4 @mobile:grid-cols-2 @mobile:gap-4
					px-[7.125rem] grid-cols-5 gap-6"
			>
				{[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 11, 22, 33, 44, 55, 66, 77].map((i) => (
					<div key={i} className="bg-black-100 w-full h-auto aspect-[13/25]">
						<div className="w-full h-auto aspect-[13/20] bg-black-300"></div>
					</div>
				))}
			</div>
		</ComponentFrame>
	);
}
