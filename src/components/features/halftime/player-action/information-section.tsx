import { GetHalftimeDetailDto } from '@/services/apis/shorts/shorts.type';
import Image from 'next/image';

export default function InformationSection({ user, title }: Pick<GetHalftimeDetailDto, 'user' | 'title'>) {
	return (
		<div
			className="absolute z-15 bottom-0 flex flex-col gap-2 w-full h-44 px-4 pb-8 justify-end rounded-b-lg"
			style={{
				background:
					'linear-gradient(180deg, rgba(255, 255, 255, 0.00) 32.39%, rgba(128, 128, 128, 0.15) 53.2%, rgba(0, 0, 0, 0.30) 100%)',
			}}
		>
			<div className="w-full font-semibold flex items-center text-black-000 text-body-03 @mobile:text-body-05">
				<div className="relative w-8 @mobile:w-6 h-auto aspect-square mr-2">
					<Image src={user.profileImageUrl || '/default-profile.svg'} alt="" fill className="rounded-full" />
				</div>
				{user.nickname}
				{user.isReporter && (
					<div className="relative w-4 @mobile:w-3 h-auto aspect-square ml-0.5">
						<Image src={'/reporter-mark.svg'} alt="구단 기자" fill />
					</div>
				)}
			</div>
			<div className="w-full h-auto line-clamp-2 break-keep text-black-000 text-body-03 @mobile:text-body-05 @mobile:leading-5">
				{title}
			</div>
		</div>
	);
}
