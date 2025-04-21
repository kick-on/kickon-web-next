import { getTimeAgo } from '@/lib/utils/getTimeAgo';
import { NewsItemDto } from '@/services/apis/news/dto';
import Image from 'next/image';
import Link from 'next/link';
import SanitizedContent from '../sanitized-content';
import getServerDeviceType from '@/lib/utils/getServerDeviceType';
import clsx from 'clsx';

export default async function NewsItem({
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
}: NewsItemDto & { isMyTeam?: boolean }) {
	const { isMobile } = await getServerDeviceType();

	return (
		<Link href={`/news/${pk}`}>
			<article className="flex flex-col py-6 px-4 cursor-pointer">
				<header className="flex gap-2 mb-2.5 items-center">
					{team && !isMyTeam && (
						<Image width={24} height={24} src={team?.logoUrl} alt={`${team?.nameKr || team?.nameEn} 로고 이미지`} />
					)}
					<div className="h-5 px-2.5 py-0.5 rounded-full bg-black-200 text-black-800 caption1-medium">{category}</div>
				</header>

				<section className={clsx('flex justify-between', { 'flex-col-reverse gap-4': isMobile })}>
					<div className={isMobile ? 'grow' : 'w-[28rem]'}>
						<h2 className={isMobile ? 'title5-semibold mb-2' : 'title3-semibold mb-2'}>
							{title.length > (isMobile ? 26 : 33) ? `${title.substring(0, isMobile ? 23 : 30).trim()}...` : title}
						</h2>
						<SanitizedContent isMobile={isMobile} content={content} />
					</div>
					<div
						className={clsx('relative my-auto', isMobile ? 'grow h-[9.5rem] rounded-md' : 'w-40 h-[6.5rem] rounded-lg')}
					>
						<Image
							fill
							className={clsx('w-auto h-auto object-cover', isMobile ? 'rounded-md' : 'rounded-lg')}
							src={thumbnailUrl}
							alt="기사 썸네일 사진"
						/>
					</div>
				</section>

				<footer className="flex flex-col w-full text-black-600 body6-regular">
					<div className="flex items-center gap-2">
						<Image
							src={user.profileImageUrl}
							alt={`${user.nickname} 프로필 사진`}
							width={24}
							height={24}
							className="w-6 h-6 rounded-full object-cover"
						/>
						<span className="flex gap-1.5 text-black-900">{user.nickname}</span>
						<span className={isMobile ? 'ml-0.5' : 'ml-2'}>{getTimeAgo(createdAt)}</span>
						<div>|</div>
						<span>읽음 {views}</span>
					</div>

					<div className="flex justify-end items-center gap-3">
						<span className="flex items-center gap-1.5">
							<Image width={18} height={18} src="/kick/gray.svg" alt="킥" />
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
