import Image from 'next/image';

export default function NewsItem({
	teamLogo,
	team,
	tag,
	title,
	content,
	nickname,
	isCertified,
	timeAgo,
	views,
	kick,
	comment,
	isMyTeam = false,
}) {
	return (
		<article className="flex flex-col py-6 px-4 cursor-pointer">
			<header className="flex gap-2 mb-2.5 items-center">
				{!isMyTeam && <Image width={24} height={24} src={teamLogo} alt={team} />}
				<div className="h-5 px-2.5 py-0.5 rounded-full bg-black-200 text-black-800 caption1-medium">{tag}</div>
			</header>

			<section className="flex justify-between">
				<div className="w-[28rem]">
					<h2 className="title3-semibold mb-2">{title.length > 33 ? `${title.substring(0, 33)}...` : title}</h2>
					<p className="subtitle2-regular mb-[1.125rem] ">
						{content.length > 120 ? `${content.substring(0, 117)}...` : content}
					</p>
				</div>
				<div className="w-40 h-[6.5rem] rounded-lg bg-black-200 my-auto">기사 사진</div>
			</section>

			<footer className="flex flex-col w-full text-black-600 body6-regular">
				<div className="flex items-center gap-2">
					<Image src="/default-profile.svg" alt="작성자 프로필" width={24} height={24} className="rounded-full" />
					<span className="flex gap-1.5 text-black-900">
						{nickname}
						{isCertified && <Image width={12} height={12} src="/certification-mark.svg" alt="인증" />}
					</span>
					<span className="ml-2">{timeAgo}</span>
					<div>|</div>
					<span>읽음 {views}</span>
				</div>

				<div className="flex justify-end items-center gap-3">
					<span className="flex items-center gap-1.5">
						<Image width={18} height={18} src="/kick/gray.svg" alt="킥" />
						<span>{kick}</span>
					</span>
					<span className="flex items-center gap-1.5">
						<Image width={18} height={18} src="/comment.svg" alt="댓글" />
						<span>{comment}</span>
					</span>
				</div>
			</footer>
		</article>
	);
}
