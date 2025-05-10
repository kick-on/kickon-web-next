'use client';

import { useState } from 'react';
import MediaButtons from './media-buttons';
import HeadingDropdown from './heading-drop-down';
import { ToolBarDivider } from './tool-bar';
import { useEditorContext } from '@/lib/contexts/editor/context';
import clsx from 'clsx';
import BoldIcon from '@/assets/editor/bold.svg';
import UnderlineIcon from '@/assets/editor/underline.svg';
import EllipsisIcon from '@/assets/editor/ellipsis.svg';
import ItalicIcon from '@/assets/editor/italic.svg';
import SortNumericIcon from '@/assets/editor/sort-numeric.svg';
import TextFormattIcon from '@/assets/editor/textformatter.svg';
import ParagraphIcon from '@/assets/editor/paragraph.svg';

const MobileToolBar = ({
	selectedOption,
	setSelectedOption,
	isVisibleDropdown,
	setIsVisibleDropdown,
	dropdownRef,
	quoteAndRuleButtons,
	mediaButtonRef,
}) => {
	const { editor, handleTextFormatToggle, handleHeadingChange } = useEditorContext();
	const [activeExtra, setActiveExtra] = useState<'format' | 'quote' | null>(null);
	const baseButtonClass = 'flex items-center px-1 py-1.25 w-8.5 h-8.5 rounded-sm bg-black-000 border border-black-300';

	const toggleExtra = (type: 'format' | 'quote') => {
		setActiveExtra((prev) => (prev === type ? null : type));
	};

	const formatButtons = [
		{ key: 'bold', Icon: BoldIcon },
		{ key: 'underline', Icon: UnderlineIcon },
		{ key: 'italic', Icon: ItalicIcon },
		{ key: 'bulletList', Icon: EllipsisIcon },
		{ key: 'orderedList', Icon: SortNumericIcon },
	];

	const extraButtons =
		activeExtra === 'format'
			? formatButtons.map(({ key, Icon }) => {
					const isActive = editor?.isActive(key);
					return (
						<button key={key} onClick={() => handleTextFormatToggle(key)}>
							<div className="w-5 h-5 flex items-center justify-center rounded-sm">
								<Icon className={clsx('w-5 h-5', isActive ? 'stroke-[#c00c0b]' : 'stroke-[#afafaf]')} />
							</div>
						</button>
					);
				})
			: activeExtra === 'quote'
				? quoteAndRuleButtons.map(({ key, Icon, onClick }) => {
						const isActive = key !== 'horizontalRule' && editor?.isActive(key);
						return (
							<button key={key} onClick={onClick} className="p-[7px] rounded-sm">
								<Icon
									className={clsx(
										'w-5 h-5 rounded-sm',
										isActive
											? 'stroke-[#c00c0b] bg-primary-50'
											: 'stroke-[#afafaf] active:stroke-[#c00c0b] active:bg-primary-50',
									)}
								/>
							</button>
						);
					})
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
					<button onClick={() => toggleExtra('format')} className={baseButtonClass}>
						<div
							className={clsx(
								'w-6 h-6 flex items-center justify-center rounded-sm',
								activeExtra === 'format' ? 'bg-primary-50 stroke-[#c00c0b]' : 'stroke-[#afafaf]',
							)}
						>
							<TextFormattIcon />
						</div>
					</button>

					<ToolBarDivider />

					{/* 인용구 버튼 */}
					<button onClick={() => toggleExtra('quote')} className={baseButtonClass}>
						<div
							className={clsx(
								'w-6 h-6 flex items-center justify-center rounded-sm',
								activeExtra === 'quote' ? 'bg-primary-50 stroke-[#c00c0b]' : 'stroke-[#afafaf]',
							)}
						>
							<ParagraphIcon />
						</div>
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
