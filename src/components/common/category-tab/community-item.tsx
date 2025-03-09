import Image from 'next/image';

export default function CommunityItem({ title, hasImage, comment, nickname, createdAt, views, kick }) {
	return (
		<div className="p-4 flex justify-between cursor-pointer">
			<div className="flex gap-1 items-center">
				<h2 className="subtitle1-medium max-w-3xs truncate">{title}</h2>
				{hasImage && <Image width={14} height={14} src="/image.svg" alt="사진" />}
				<div className="body5-regular">({comment})</div>
			</div>
			<div className="flex gap-4 body6-regular text-black-600 items-center">
				<div className="flex gap-2 text-black-900">
					<Image width={18} height={18} src="/default-profile.svg" alt="프로필 사진" />
					<div className="w-[5.625rem]">{nickname}</div>
				</div>
				<div className="w-[4.0625rem] text-center">{createdAt}</div>
				<div className="w-[2.625rem] text-center">{views}</div>
				<div className="w-[2.6875rem] text-center">{kick}</div>
			</div>
		</div>
	);
}
