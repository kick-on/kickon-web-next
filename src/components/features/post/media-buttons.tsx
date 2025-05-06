import { useEditorContext } from '@/lib/contexts/editor/context';
import Image from 'next/image';

const MediaButtons = ({ mediaButtonRef }) => {
	const {
		showLinkInput,
		setShowLinkInput,
		linkUrl,
		setLinkUrl,
		handleInsertLink,
		showYoutubeInput,
		setShowYoutubeInput,
		youtubeUrl,
		setYoutubeUrl,
		handleInsertYoutube,
		handleAddImage,
	} = useEditorContext();

	const mediaButtons = [
		{
			key: 'link',
			icon: <Image src="/editor/link.svg" alt="링크 붙여넣기" width={20} height={20} />,
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
			icon: <Image src="/editor/video.svg" alt="유튜브 영상 붙여넣기" width={20} height={20} />,
			onClick: () => {
				if (showLinkInput) setShowLinkInput(false);
				setShowYoutubeInput(!showYoutubeInput);
			},
			isLabel: false,
		},
	];

	return (
		<div ref={mediaButtonRef} className="relative flex h-8.5 gap-2 @mobile:gap-1.5">
			{mediaButtons.map((btn) =>
				btn.isLabel ? (
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
				) : (
					<button
						key={btn.key}
						className={`p-[7px] bg-black-000 border border-black-300 rounded-sm relative ${btn.key}`}
						onClick={btn.onClick}
					>
						{btn.icon}
					</button>
				),
			)}

			{/* 링크 인풋 */}
			{showLinkInput && (
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
			)}

			{/* 유튜브 인풋 */}
			{showYoutubeInput && (
				<div className="absolute top-full left-0 mt-1 flex gap-0.5 h-10 z-50">
					<input
						className="flex-1 p-2 w-60 bg-black-000 px-2 border border-black-300 rounded-lg shadow-md focus:outline-none"
						type="text"
						placeholder="유튜브 링크를 입력하세요."
						value={youtubeUrl}
						onChange={(e) => setYoutubeUrl(e.target.value)}
					/>
					<button
						className={`button4-medium px-3 py-1 rounded-lg shadow-md whitespace-nowrap flex items-center 
							${youtubeUrl ? 'bg-primary-900 text-black-000' : 'bg-black-000 text-black-600 border border-black-300 cursor-not-allowed'}`}
						onClick={() => {
							if (!youtubeUrl) return;
							handleInsertYoutube();
						}}
					>
						업로드
					</button>
				</div>
			)}
		</div>
	);
};

export default MediaButtons;
