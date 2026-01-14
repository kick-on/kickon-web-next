'use client';

import { useState } from 'react';
import MediaButtons from './media-buttons';
import HeadingDropdown from './heading-drop-down';
import { ToolBarDivider } from './tool-bar';
import { useEditorContext } from '@/lib/contexts/editor/context';
import clsx from 'clsx';
import TextFormatIcon from '@/assets/editor/textformatter.svg';
import ParagraphIcon from '@/assets/editor/paragraph.svg';
import TextFormatButtons from '@/components/features/post/editor/text-format-buttons';
import BlockFormatButtons from '@/components/features/post/editor/block-format-buttons';
import InteractionButtons from '@/components/features/post/editor/interaction-buttons';

const MobileToolBar = ({
	selectedOption,
	setSelectedOption,
	isVisibleDropdown,
	setIsVisibleDropdown,
	dropdownRef,
	mediaButtonRef,
}) => {
	const { handleHeadingChange } = useEditorContext();
	const [activeExtra, setActiveExtra] = useState<'text' | 'block' | null>(null);
	const baseButtonClass = 'flex items-center px-1 py-1.25 w-8.5 h-8.5 rounded-sm bg-black-000 border border-black-300';

	const toggleExtra = (type: 'text' | 'block') => {
		setActiveExtra((prev) => (prev === type ? null : type));
	};

	const extraButtons =
		activeExtra === 'text' ? <TextFormatButtons /> : activeExtra === 'block' ? <BlockFormatButtons /> : null;

	return (
		<>
			<div className="w-full bg-black-100 border border-b-0 border-black-300 p-1.5 h-11.5 rounded-tl-lg rounded-tr-lg">
				<div className="flex items-center overflow-x-scroll no-scrollbar">
					<HeadingDropdown
						selectedOption={selectedOption}
						setSelectedOption={setSelectedOption}
						isVisibleDropdown={isVisibleDropdown}
						setIsVisibleDropdown={setIsVisibleDropdown}
						handleHeadingChange={handleHeadingChange}
						dropdownRef={dropdownRef}
					/>
					<ToolBarDivider />

					{/* 텍스트 포맷 버튼 */}
					<button onClick={() => toggleExtra('text')} className={baseButtonClass}>
						<div
							className={clsx(
								'w-6 h-6 flex items-center justify-center rounded-sm',
								activeExtra === 'text' ? 'bg-primary-50 stroke-primary-900' : 'stroke-black-600',
							)}
						>
							<TextFormatIcon />
						</div>
					</button>
					<ToolBarDivider />

					{/* 블록 포맷 버튼 */}
					<button onClick={() => toggleExtra('block')} className={baseButtonClass}>
						<div
							className={clsx(
								'w-6 h-6 flex items-center justify-center rounded-sm',
								activeExtra === 'block' ? 'bg-primary-50 stroke-primary-900' : 'stroke-black-600',
							)}
						>
							<ParagraphIcon />
						</div>
					</button>
					<ToolBarDivider />

					<MediaButtons mediaButtonRef={mediaButtonRef} />
					<ToolBarDivider />

					<InteractionButtons />
				</div>
			</div>

			{/* 툴바 아래에 추가로 나타나는 영역 */}
			{activeExtra && (
				<div className="bg-black-100 h-9.5 border border-b-0 border-black-300 flex items-center px-4 gap-5">
					{extraButtons}
				</div>
			)}
		</>
	);
};

export default MobileToolBar;
