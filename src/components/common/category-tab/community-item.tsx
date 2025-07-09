import { formatStringToDate } from '@/lib/utils/formatStringToDate';
import { BoardItemDto } from '@/services/apis/board/dto';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

type CommunityItemProps = BoardItemDto & {
	isPinned?: boolean;
};
export default function CommunityItem({
	pk,
	title,
	replies,
	user,
	team,
	createdAt,
	hasImage,
	views,
	likes,
	isPinned,
}: CommunityItemProps) {
	return (
		<Link
			href={`/board/${pk}`}
			className={clsx(
				'p-4 flex justify-between cursor-pointer @mobile:flex-col @mobile:gap-3 group',
				isPinned && 'bg-primary-50',
			)}
		>
			<div className="flex gap-1 items-center pr-2">
				{team && (
					<Image
						width={16}
						height={16}
						src={team.logoUrl}
						alt={team.nameKr || team.nameEn}
						className="object-contain"
					/>
				)}{' '}
				<h2
					className={clsx(
						'subtitle1-medium max-w-3xs truncate group-hover:underline',
						'@mobile:max-w-max @mobile:w-fit @mobile:text-15 @mobile:leading-4',
						isPinned && 'text-primary-900 font-semibold @mobile:font-semibold',
					)}
				>
					{title}
				</h2>
				{hasImage && <Image width={14} height={14} src="/image.svg" alt="사진" />}
				<div className="body5-regular">{!!replies && `(${replies})`}</div>
			</div>

			<div
				className="flex gap-4 body6-regular text-black-600 items-center
					@mobile:gap-3 @mobile:text-12 @mobile:font-regular @mobile:leading-5"
			>
				<div className="flex gap-2 text-black-900">
					<Image
						width={18}
						height={18}
						className="@mobile:hidden rounded-full w-[1.125rem] h-[1.125rem] object-cover"
						src={user.profileImageUrl || '/default-profile.svg'}
						alt={`${user.nickname} 프로필 사진`}
					/>
					<div className="w-[5.625rem] @mobile:w-fit">{user.nickname}</div>
				</div>

				<div className="@mobile:hidden w-[4.0625rem] text-center">{formatStringToDate(createdAt)}</div>
				<div className="@mobile:inline hidden w-fit text-center">{formatStringToDate(createdAt, '2-digit')}</div>

				<div className="@mobile:inline hidden">|</div>

				<div className="w-[2.625rem] text-center @mobile:w-fit">
					<span className="hidden @mobile:inline">읽음&nbsp;</span>
					{views}
				</div>

				<div className="@mobile:inline hidden">|</div>

				<div className="w-[2.6875rem] text-center @mobile:w-fit @mobile:flex @mobile:gap-1 @mobile:items-center">
					<Image
						src={'/kick/gray.svg'}
						alt="킥"
						width={16}
						height={16}
						className="@mobile:inline hidden w-4 h-4 object-contain"
					/>
					{likes}
				</div>
			</div>
		</Link>
	);
}
