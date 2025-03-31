import { getTimeAgo } from '@/lib/utils/getTimeAgo';
import { NewsItemDto } from '@/services/apis/news/dto';
import Image from 'next/image';
import Link from 'next/link';

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
	isMyTeam = false,
}: NewsItemDto & { isMyTeam?: boolean }) {
	// TODO: 서버 응답 수정에 따라 팀 로고 src/alt 수정, 인증 뱃지 추가가
	return (
		<Link href={`news/${pk}`}>
			<article className="flex flex-col py-6 px-4 cursor-pointer">
				<header className="flex gap-2 mb-2.5 items-center">
					{!isMyTeam && <Image width={24} height={24} src={'/team-logo/arsenal.svg'} alt={'팀 로고'} />}
					<div className="h-5 px-2.5 py-0.5 rounded-full bg-black-200 text-black-800 caption1-medium">{category}</div>
				</header>

				<section className="flex justify-between">
					<div className="w-[28rem]">
						<h2 className="title3-semibold mb-2">{title.length > 33 ? `${title.substring(0, 33)}...` : title}</h2>
						<p className="subtitle2-regular mb-[1.125rem] ">
							{content.length > 120 ? `${content.substring(0, 117)}...` : content}
						</p>
					</div>
					<Image
						width={160}
						height={104}
						src={thumbnailUrl}
						alt="기사 썸네일 사진"
						className="w-40 h-[6.5rem] rounded-lg my-auto object-cover"
					/>
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
						<span className="flex gap-1.5 text-black-900">
							{user.nickname}
							{/* {isCertified && <Image width={12} height={12} src="/certification-mark.svg" alt="인증" />} */}
						</span>
						<span className="ml-2">{getTimeAgo(createdAt)}</span>
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
