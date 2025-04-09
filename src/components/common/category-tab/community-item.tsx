import { formatStringToDate } from '@/lib/utils/formatStringToDate';
import { BoardItemDto } from '@/services/apis/news/dto';
import Image from 'next/image';
import Link from 'next/link';

export default function CommunityItem({ pk, title, replies, user, createdAt, hasImage, views, likes }: BoardItemDto) {
	return (
		<Link href={`/board/${pk}`} className="p-4 flex justify-between cursor-pointer">
			<div className="flex gap-1 items-center">
				<p className="subtitle1-medium max-w-3xs truncate">{title}</p>
				{hasImage && <Image width={14} height={14} src="/image.svg" alt="사진" />}
				<div className="body5-regular">{!!replies && `(${replies})`}</div>
			</div>
			<div className="flex gap-4 body6-regular text-black-600 items-center">
				<div className="flex gap-2 text-black-900">
					<Image
						width={18}
						height={18}
						className="rounded-full w-[1.125rem] h-[1.125rem] object-cover"
						src={user.profileImageUrl}
						alt={`${user.nickname} 프로필 사진`}
					/>
					<div className="w-[5.625rem]">{user.nickname}</div>
				</div>
				<div className="w-[4.0625rem] text-center">{formatStringToDate(createdAt)}</div>
				<div className="w-[2.625rem] text-center">{views}</div>
				<div className="w-[2.6875rem] text-center">{likes}</div>
			</div>
		</Link>
	);
}
