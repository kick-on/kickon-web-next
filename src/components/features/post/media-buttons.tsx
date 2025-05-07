'use client';
import { useEditorContext } from '@/lib/contexts/editor/context';
import LinkIcon from '@/assets/editor/link.svg';
import VideoIcon from '@/assets/editor/video.svg';

import Image from 'next/image';
import clsx from 'clsx';
import LinkInputModal from './mobile-link-input';
import useIsMobile from '@/lib/hooks/useIsMobile';

const MediaButtons = ({ mediaButtonRef }) => {
	const isMobile = useIsMobile();
	const {
		showLinkInput,
		setShowLinkInput,
		linkUrl,
		setLinkUrl,
		handleInsertLink,
		showYoutubeInput,
		setShowYoutubeInput,
		handleAddImage,
	} = useEditorContext();

	const mediaButtons = [
		{
			key: 'link',
			Icon: LinkIcon,
			onClick: () => {
				if (showYoutubeInput) setShowYoutubeInput(false);
				setShowLinkInput(!showLinkInput);
			},
			isLabel: false,
		},
		{
			key: 'image',
			icon: <Image src="/image.svg" alt="사진 붙여넣기" width={20} height={20} />,
			onClick: () => {
				if (showLinkInput) setShowLinkInput(false);
				if (showYoutubeInput) setShowYoutubeInput(false);
			},
			onChange: handleAddImage,
			accept: 'image/*',
			isLabel: true,
		},
		{
			key: 'youtube',
			Icon: VideoIcon,
			onClick: () => {
				if (showLinkInput) setShowLinkInput(false);
				setShowYoutubeInput(!showYoutubeInput);
			},
			isLabel: false,
		},
	];

	return (
		<div ref={mediaButtonRef} className="relative flex h-8.5 gap-2 @mobile:gap-1.5">
			{mediaButtons.map((btn) => {
				const isActive = btn.key === 'link' ? showLinkInput : btn.key === 'youtube' ? showYoutubeInput : false;

				if (btn.isLabel) {
					// 이미지 버튼
					return (
						<label
							onClick={btn.onClick}
							key={btn.key}
							className="cursor-pointer p-[7px] bg-black-000 border border-black-300 rounded-sm"
						>
							{btn.icon}
							<input
								type="file"
								accept={btn.accept}
								className="hidden"
								onClick={(e) => ((e.target as HTMLInputElement).value = '')}
								onChange={btn.onChange}
							/>
						</label>
					);
				}

				// 링크, 유튜브 버튼
				return (
					<button
						key={btn.key}
						onClick={btn.onClick}
						className="p-[7px] bg-black-000 border border-black-300 rounded-sm"
					>
						<div className={clsx('w-5 h-5 flex items-center justify-center rounded-sm', isActive && 'bg-primary-50')}>
							<btn.Icon className={`${isActive ? 'stroke-[#c00c0b] rounded-xs bg-primary-50' : 'stroke-[#8f8f8f]'}`} />
						</div>
					</button>
				);
			})}

			{/*링크 input*/}
			{showLinkInput &&
				(isMobile ? (
					<LinkInputModal onClose={() => setShowLinkInput(false)} />
				) : (
					<div className="absolute top-full left-0 mt-1 flex gap-0.5 h-10 z-50">
						<input
							className="flex-1 p-2 w-60 bg-black-000 px-2 border border-black-300 rounded-lg shadow-md focus:outline-none"
							type="text"
							placeholder="URL을 입력하세요."
							value={linkUrl}
							onChange={(e) => setLinkUrl(e.target.value)}
						/>
						<button
							className={`button4-medium px-3 py-1 rounded-lg shadow-md whitespace-nowrap flex items-center 
					${linkUrl ? 'bg-primary-900 text-black-000' : 'bg-black-000 text-black-600 border border-black-300'}`}
							onClick={() => {
								if (!linkUrl) return;
								handleInsertLink();
								setShowLinkInput(false);
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
