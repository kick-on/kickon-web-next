import { getRelativeTime } from '@/lib/utils';
import { NewsListDto } from '@/services/apis/news/news.type';
import Image from 'next/image';
import Link from 'next/link';
import SanitizedContent from '../sanitized-content';
import clsx from 'clsx';
import KickIcon from '@/assets/common/kick/fill-white.svg';

export default function NewsItem({
	pk,
	title,
	content,
	user,
	category,
	thumbnailUrl,
	createdAt,
	views,
	likes,
	replies,
	team,
	isMyTeam = false,
}: NewsListDto & { isMyTeam?: boolean }) {
	return (
		<Link href={`/news/${pk}`} className="group">
			<article className="flex flex-col my-2 py-4 px-4 cursor-pointer">
				<header className="flex gap-2 mb-2.5 items-center">
					{team && !isMyTeam && (
						<Image
							className="w-6 h-6 object-contain"
							width={24}
							height={24}
							src={team.logoUrl}
							alt={`${team?.nameKr || team?.nameEn} 로고 이미지`}
						/>
					)}
					<div className="h-5 px-2.5 py-0.5 rounded-full bg-black-200 text-black-800 caption1-medium">{category}</div>
				</header>

				<section className={clsx('flex justify-between @mobile:flex-col-reverse @mobile:gap-4')}>
					<div className={'w-[28rem] @mobile:grow @mobile:w-auto'}>
						<h2
							className="title3-semibold pb-2 pr-2 truncate group-hover:underline group-hover:underline-offset-3
								@mobile:text-16 @mobile:font-semibold @mobile:leading-4"
						>
							{title}
						</h2>
						<SanitizedContent content={content} />
					</div>
					<div
						className="relative my-auto w-40 h-[6.5rem] rounded-lg
							@mobile:w-auto @mobile:h-auto @mobile:grow @mobile:aspect-[2/1] @mobile:rounded-md"
					>
						<Image
							fill
							className={clsx('w-auto h-auto object-cover rounded-lg @mobile:rounded-md')}
							src={thumbnailUrl}
							alt="기사 썸네일 사진"
						/>
					</div>
				</section>

				<footer className="flex flex-col gap-0.5 w-full text-black-600 body6-regular">
					<div className="flex items-center gap-2">
						<Image
							src={user.profileImageUrl || '/default-profile.svg'}
							alt={`${user.nickname} 프로필 사진`}
							width={24}
							height={24}
							className="w-6 h-6 rounded-full object-cover"
						/>
						<span className="flex items-center gap-0.5 text-black-900">
							{user.nickname}
							{user.isReporter && <Image width={12} height={12} src="/reporter-mark.svg" alt="구단 기자" />}
						</span>
						<span className={'@mobile:ml-0.5 ml-2'}>{getRelativeTime(createdAt)}</span>
						<div>|</div>
						<span>읽음 {views}</span>
					</div>

					<div className="flex justify-end items-center gap-3">
						<span className="flex items-center gap-1.5">
							<KickIcon width={18} height={18} className="text-[#8F8F8F]" />
							<span>{likes}</span>
						</span>
						<span className="flex items-center gap-1.5">
							<Image width={18} height={18} src="/comment.svg" alt="댓글" />
							<span>{replies}</span>
						</span>
					</div>
				</footer>
			</article>
		</Link>
	);
}
