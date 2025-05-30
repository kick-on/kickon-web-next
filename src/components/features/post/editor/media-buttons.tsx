'use client';
import { useEditorContext } from '@/lib/contexts/editor/context';
import LinkIcon from '@/assets/editor/link.svg';
import VideoIcon from '@/assets/editor/video.svg';

import Image from 'next/image';
import clsx from 'clsx';
import useIsMobile from '@/lib/hooks/useIsMobile';
import MobileLinkInput from './mobile-link-input';

const MediaButtons = ({ mediaButtonRef }) => {
	const isMobile = useIsMobile();
	const {
		isLinkInputOpen,
		setIsLinkInputOpen,
		linkUrl,
		setLinkUrl,
		handleInsertLink,
		isYoutubeInputOpen,
		setIsYoutubeInputOpen,
		handleAddImage,
		handleAddVideo,
	} = useEditorContext();

	const mediaButtons = [
		{
			key: 'link',
			Icon: LinkIcon,
			onClick: () => {
				if (isYoutubeInputOpen) setIsYoutubeInputOpen(false);
				setIsLinkInputOpen(!isLinkInputOpen);
			},
			isLabel: false,
		},
		{
			key: 'image',
			icon: <Image src="/image.svg" alt="사진 붙여넣기" width={20} height={20} />,
			onClick: () => {
				if (isLinkInputOpen) setIsLinkInputOpen(false);
				if (isYoutubeInputOpen) setIsYoutubeInputOpen(false);
			},
			onChange: handleAddImage,
			accept: 'image/*',
			isLabel: true,
		},
		{
			key: 'video',
			Icon: VideoIcon,
			onClick: () => {
				if (isLinkInputOpen) setIsLinkInputOpen(false);
			},
			onChange: handleAddVideo,
			accept: 'video/*',
			isLabel: false,
		},
	];

	return (
		<div ref={mediaButtonRef} className="relative flex h-8.5 gap-2 @mobile:gap-1.5">
			{mediaButtons.map((btn) => {
				// 링크 버튼은 버튼만 렌더링
				if (btn.key === 'link') {
					const isActive = isLinkInputOpen;

					return (
						<button
							key={btn.key}
							onClick={btn.onClick}
							className="w-[34px] px-[5px] bg-black-000 border border-black-300 rounded-sm"
						>
							<div className={clsx('w-6 h-6 flex items-center justify-center rounded-sm', isActive && 'bg-primary-50')}>
								<btn.Icon className={`${isActive ? 'stroke-primary-900' : 'stroke-black-600'}`} />
							</div>
						</button>
					);
				}

				// 이미지, 영상 버튼은 <label> + <input type="file">
				return (
					<label
						key={btn.key}
						onClick={btn.onClick}
						className="w-[34px] flex items-center cursor-pointer px-[5px] bg-black-000 border border-black-300 rounded-sm"
					>
						<div className="w-6 h-6 flex items-center justify-center">
							{btn.icon ? btn.icon : btn.Icon && <btn.Icon className="stroke-black-600" />}
						</div>
						<input
							type="file"
							accept={btn.accept}
							className="hidden"
							onClick={(e) => ((e.target as HTMLInputElement).value = '')}
							onChange={btn.onChange}
						/>
					</label>
				);
			})}

			{/*링크 input*/}
			{isLinkInputOpen &&
				(isMobile ? (
					<MobileLinkInput onClose={() => setIsLinkInputOpen(false)} />
				) : (
					<div className="absolute top-full left-0 mt-1 flex gap-0.5 h-10 z-50">
						<input
							className="flex-1 p-2 w-60 bg-black-000 px-2 border border-black-300 rounded-lg shadow-md focus:outline-none"
							type="text"
							placeholder="링크를 입력해 주세요."
							value={linkUrl}
							onChange={(e) => setLinkUrl(e.target.value)}
						/>
						<button
							className={`button4-medium px-3 py-1 rounded-lg shadow-md whitespace-nowrap flex items-center 
					${linkUrl ? 'bg-primary-900 text-black-000' : 'bg-black-000 text-black-600 border border-black-300'}`}
							onClick={() => {
								if (!linkUrl) return;
								handleInsertLink();
								setIsLinkInputOpen(false);
								setLinkUrl('');
							}}
							disabled={!linkUrl}
						>
							저장
						</button>
					</div>
				))}
		</div>
	);
};

export default MediaButtons;
