import ComponentFrame from '@/components/common/component-frame';
import Video from '@/components/features/halftime/video';
import Image from 'next/image';

const data = {
	title: '기성용 이적에 역대급 폭발한 FC 서울 팬들 어쩌구저쩌구',
	views: 2,
	kick: 1.2,
};

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
					<div key={i} className="w-full h-auto aspect-[13/25]">
						<div className="w-full h-auto aspect-[13/20] rounded-lg overflow-hidden">
							{i % 2 === 1 ? <Video src="/video/test1.mp4" /> : <Video src="/video/test2.mp4" />}
						</div>

						<h3 className="button2-medium my-2 @mobile:mb-1.5 @mobile:text-14">
							{data.title.length > 27 ? data.title.slice(0, 27) + '...' : data.title}
						</h3>
						<div className="body5-regular text-black-600 flex gap-2 @mobile:text-12 items-center">
							<span>조회수 {data.views}만 회</span>
							<div className="h-3 w-px bg-black-600" />
							<span className="flex gap-1.5 items-center">
								<Image src={'/kick/gray.svg'} alt="" width={16} height={16} />킥 {data.kick}천
							</span>
						</div>
					</div>
				))}
			</div>
		</ComponentFrame>
	);
}
