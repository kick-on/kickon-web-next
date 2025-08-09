import ComponentFrame from '@/components/common/component-frame';
import PreviewWithTitle from '@/components/features/halftime/preview-with-title';

const data = {
	title: '기성용 이적에 역대급 폭발한 FC 서울 팬들 어쩌구저쩌구',
	viewCount: 2,
	kickCount: 1.2,
};

export default function Page() {
	return (
		<ComponentFrame className="@mobile:w-full! max-[1440px]:w-[80%]! w-[90%]! max-w-[1360px] mx-auto mt-4 @mobile:mt-0 @mobile:bg-transparent @mobile:border-0">
			<div
				className="grid py-6
					max-[1440px]:px-4 max-[1440px]:grid-cols-4 max-[1440px]:gap-x-3
					max-[1094px]:px-4 max-[1094px]:grid-cols-3 max-[1094px]:gap-x-3
					@mobile:px-4 @mobile:grid-cols-2 @mobile:gap-4
					px-[7.125rem] grid-cols-5 gap-6"
			>
				{[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 11, 22, 33, 44, 55, 66, 77].map((i) => (
					<PreviewWithTitle
						key={i}
						pk={i}
						title={data.title}
						viewCount={data.viewCount}
						kickCount={data.kickCount}
						videoUrl={
							i % 3 === 0
								? '/video/test1.mp4'
								: i % 3 === 1
									? 'https://www.youtube.com/shorts/R39fXsyQN_o'
									: 'https://youtu.be/3-G0Z_sjRiQ?si=JN6gcWPQ5Sp3ffw6'
						}
					/>
				))}
			</div>
		</ComponentFrame>
	);
}
