import Image from 'next/image';
import Preview from '../halftime/preview';
import ComponentFrame from '../../common/component-frame';
import Link from 'next/link';

const data = {
	title: '기성용 이적에 역대급 폭발한 FC 서울 팬들 어쩌구저쩌구',
	views: 2,
	kick: 1.2,
};

export default function TodaysHalftime() {
	return (
		<ComponentFrame isMain className="pt-[1.875rem] px-4 pb-6">
			<header className="flex justify-between mb-[1.875rem]">
				<h3 className="title4-semibold @mobile:text-16">오늘의 하프타임🔥</h3>
				<Link
					href={'/halftime'}
					aria-label="더 보기"
					className="@mobile:text-[12px] flex gap-2 items-center text-black-700 body5-regular"
				>
					<span>더 보기</span>
					<Image
						src="/chevron/right-gray.svg"
						width={18}
						height={18}
						className="@mobile:w-4 @mobile:h-4"
						alt="오른쪽 화살표"
					/>
				</Link>
			</header>

			{/* TODO: Link 전체를 Preview로 컴포넌트화 */}
			<div className="grid grid-cols-2 grid-rows-2 gap-x-3 gap-y-4">
				{[1, 2, 3, 4].map((i) => (
					<Link key={i} href={'/halftime/1'} className="w-full h-auto aspect-[13/25]">
						<div className="w-full h-auto aspect-[13/20] rounded-lg overflow-hidden">
							<Preview src="https://youtu.be/3-G0Z_sjRiQ?si=JN6gcWPQ5Sp3ffw6" />
						</div>

						<h3 className="button2-medium my-2 @mobile:mb-1.5 @mobile:text-14">
							{data.title.length > 27 ? data.title.slice(0, 27) + '...' : data.title}
						</h3>
						<div className="body5-regular text-black-600 flex gap-2 @mobile:text-12 items-center">
							<span>조회수 {data.views}만회</span>
							<div className="h-3 w-px bg-black-600" />
							<span className="flex gap-1.5 items-center">
								<Image src={'/kick/gray.svg'} alt="" width={16} height={16} />킥 {data.kick}천
							</span>
						</div>
					</Link>
				))}
			</div>
		</ComponentFrame>
	);
}
