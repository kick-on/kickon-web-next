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
}) {
	return (
		<div className="flex flex-col py-6 px-4 cursor-pointer">
			<div className="flex gap-7">
				<div className="flex flex-col w-md">
					<div className="flex gap-2 mb-2.5 items-center">
						<Image width={24} height={24} src={teamLogo} alt={team} />
						<div className="h-5 px-2.5 py-0.5 rounded-full bg-black-200 text-black-800 caption1-medium">{tag}</div>
					</div>
					<div>
						<div className="title3-semibold mb-2">{title}</div>
						<div className="subtitle2-regular mb-[1.125rem] ">
							{content.length > 120 ? `${content.substring(0, 117)}...` : content}
						</div>
					</div>
					<div className="flex gap-4 items-center">
						<div className="flex items-center">
							<div className="w-6 h-6 bg-black-200 rounded-full"></div>
							<div className="ml-2 body6-regular">{nickname}</div>
							{isCertified && (
								<Image className="ml-1.5" width={12} height={12} src="/certification-mark.svg" alt="인증 마크" />
							)}
						</div>
						<div className="flex gap-2 body6-regular text-black-600">
							<div>{timeAgo}</div>
							<div>|</div>
							<div>읽음 {views}</div>
						</div>
					</div>
				</div>
				<div className="w-40 h-[6.5rem] rounded-lg bg-black-200 my-auto">기사 사진</div>
			</div>
			<div className="flex gap-3 ml-auto body5-regular text-black-600">
				<div className="flex items-center gap-1.5">
					<Image width={18} height={18} src="/kick-gray.svg" alt="킥" />
					{kick}
				</div>
				<div className="flex items-center gap-1.5">
					<Image width={18} height={18} src="/comment.svg" alt="댓글" />
					{comment}
				</div>
			</div>
		</div>
	);
}
