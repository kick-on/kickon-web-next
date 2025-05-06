'use client';

import { useState } from 'react';
import MediaButtons from './media-buttons';
import HeadingDropdown from './heading-drop-down';
import { ToolBarDivider } from './tool-bar';
import Image from 'next/image';
import { useEditorContext } from '@/lib/contexts/editor/context';
import clsx from 'clsx';

const MobileToolBar = ({
	selectedOption,
	setSelectedOption,
	isVisibleDropdown,
	setIsVisibleDropdown,
	dropdownRef,
	quoteAndRuleButtons,
	mediaButtonRef,
}) => {
	const { handleTextFormatToggle, handleHeadingChange } = useEditorContext();
	const [activeExtra, setActiveExtra] = useState<'format' | 'quote' | null>(null);
	const baseButtonClass = 'flex items-center px-1 py-1.25 w-8.5 h-8.5 rounded-sm bg-black-000 border border-black-300';

	const toggleExtra = (type: 'format' | 'quote') => {
		setActiveExtra((prev) => (prev === type ? null : type));
	};

	const extraButtons =
		activeExtra === 'format'
			? [
					{ key: 'bold', icon: '/editor/bold.svg' },
					{ key: 'underline', icon: '/editor/underline.svg' },
					{ key: 'italic', icon: '/editor/italic.svg' },
					{ key: 'bulletList', icon: '/editor/ellipsis.svg' },
					{ key: 'orderedList', icon: '/editor/sort-numeric.svg' },
				].map((btn) => (
					<button key={btn.key} onClick={() => handleTextFormatToggle(btn.key)}>
						<Image src={btn.icon} alt={btn.key} width={18} height={18} />
					</button>
				))
			: activeExtra === 'quote'
				? quoteAndRuleButtons.map((btn) => (
						<button key={btn.key} onClick={btn.onClick}>
							{btn.icon}
						</button>
					))
				: null;

	return (
		<>
			<div className="bg-black-100 border border-b-0 border-black-300 p-1.5 h-11.5 rounded-tl-lg rounded-tr-lg">
				<div className="flex items-center">
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
					<button onClick={() => toggleExtra('format')} className={`${baseButtonClass}`}>
						<Image
							src="/editor/textformatter.svg"
							alt="텍스트 포맷 버튼"
							width={20}
							height={20}
							className={clsx('w-6 h-6 rounded-xs', activeExtra === 'format' && 'bg-primary-50')}
						/>
					</button>

					<ToolBarDivider />

					{/*인용구 버튼*/}
					<button onClick={() => toggleExtra('quote')} className={`${baseButtonClass}`}>
						<Image
							src="/editor/paragraph.svg"
							alt="텍스트 포맷 버튼"
							width={20}
							height={20}
							className={clsx('w-6 h-6 rounded-xs', activeExtra === 'quote' && 'bg-primary-50')}
						/>
					</button>

					<ToolBarDivider />

					<MediaButtons mediaButtonRef={mediaButtonRef} />
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
