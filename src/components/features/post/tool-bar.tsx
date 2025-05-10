'use client';

import clsx from 'clsx';
import { useRef, useEffect, useState } from 'react';
import { headingOptions } from '@/lib/constants/options';
import useIsMobile from '@/lib/hooks/useIsMobile';
import { useEditorContext } from '@/lib/contexts/editor/context';
import MobileToolBar from './mobile-tool-bar';
import HeadingDropdown from './heading-drop-down';
import MediaButtons from './media-buttons';
import BoldIcon from '@/assets/editor/bold.svg';
import UnderlineIcon from '@/assets/editor/underline.svg';
import EllipsisIcon from '@/assets/editor/ellipsis.svg';
import ItalicIcon from '@/assets/editor/italic.svg';
import SortNumericIcon from '@/assets/editor/sort-numeric.svg';
import QuoteIcon from '@/assets/editor/quote.svg';
import lineIcon from '@/assets/editor/line.svg';

export const ToolBarDivider = () => <div className="bg-[#E0E0E0] w-px @mobile:w-0.25 h-4.5 mx-2" />;

export default function Toolbar() {
	const {
		editor,
		showLinkInput,
		setShowLinkInput,
		handleTextFormatToggle,
		handleHeadingChange,
		showYoutubeInput,
		setShowYoutubeInput,
	} = useEditorContext();
	const isMobile = useIsMobile();
	const [hasMounted, setHasMounted] = useState(false);

	useEffect(() => {
		setHasMounted(true);
	}, []);

	const [isVisibleDropdown, setIsVisibleDropdown] = useState(false);
	const [selectedOption, setSelectedOption] = useState(headingOptions[0]);

	const dropdownRef = useRef<HTMLDivElement>(null);
	const linkInputRef = useRef<HTMLDivElement>(null);
	const youtubeInputRef = useRef<HTMLDivElement>(null);
	const mediaButtonRef = showLinkInput ? linkInputRef : showYoutubeInput ? youtubeInputRef : null;

	const textFormatButtons = [
		{ key: 'bold', Icon: BoldIcon },
		{ key: 'underline', Icon: UnderlineIcon },
		{ key: 'italic', Icon: ItalicIcon },
		{ key: 'bulletList', Icon: EllipsisIcon },
		{ key: 'orderedList', Icon: SortNumericIcon },
	];

	const quoteAndRuleButtons = [
		{
			key: 'blockquote',
			Icon: QuoteIcon,
			onClick: () => handleTextFormatToggle('blockquote'),
		},
		{
			key: 'horizontalRule',
			Icon: lineIcon,
			onClick: () => {
				handleTextFormatToggle('horizontalRule');
			},
		},
	];

	useEffect(() => {
		if (!editor) return;

		const updateHeadingOption = () => {
			if (editor.isActive('heading', { level: 1 })) {
				setSelectedOption(headingOptions.find((opt) => opt.value === '1')!);
			} else if (editor.isActive('heading', { level: 2 })) {
				setSelectedOption(headingOptions.find((opt) => opt.value === '2')!);
			} else if (editor.isActive('heading', { level: 3 })) {
				setSelectedOption(headingOptions.find((opt) => opt.value === '3')!);
			} else {
				setSelectedOption(headingOptions.find((opt) => opt.value === 'paragraph')!);
			}
		};

		editor.on('selectionUpdate', updateHeadingOption);

		// 초기 실행
		updateHeadingOption();

		return () => {
			editor.off('selectionUpdate', updateHeadingOption);
		};
	}, [editor]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Node;

			// Heading 드롭다운
			if (dropdownRef.current && !dropdownRef.current.contains(target)) {
				setIsVisibleDropdown(false);
			}
			// Link Input
			if (linkInputRef.current && !linkInputRef.current.contains(target)) {
				setShowLinkInput(false);
			}
			// Youtube Input
			if (youtubeInputRef.current && !youtubeInputRef.current.contains(target)) {
				setShowYoutubeInput(false);
			}
		};
		document.addEventListener('click', handleClickOutside);
		return () => document.removeEventListener('click', handleClickOutside);
	}, [setShowLinkInput, setShowYoutubeInput]);

	if (!hasMounted) return null;

	return isMobile ? (
		<MobileToolBar
			selectedOption={selectedOption}
			setSelectedOption={setSelectedOption}
			isVisibleDropdown={isVisibleDropdown}
			setIsVisibleDropdown={setIsVisibleDropdown}
			dropdownRef={dropdownRef}
			mediaButtonRef={mediaButtonRef}
			quoteAndRuleButtons={quoteAndRuleButtons}
		/>
	) : (
		<div className="flex flex-wrap items-center gap-2 pb-4">
			{/*헤딩 드롭다운*/}
			<HeadingDropdown
				selectedOption={selectedOption}
				setSelectedOption={setSelectedOption}
				isVisibleDropdown={isVisibleDropdown}
				setIsVisibleDropdown={setIsVisibleDropdown}
				handleHeadingChange={handleHeadingChange}
				dropdownRef={dropdownRef}
			/>

			<ToolBarDivider />

			{/*텍스트 포맷 형식*/}
			<div className="flex h-8.5 text-center gap-2 border border-black-300 text-[#8C8C8C] rounded-sm px-2 py-1.75">
				{textFormatButtons.map(({ key, Icon }) => {
					const isActive = editor?.isActive(key);

					return (
						<button
							key={key}
							className={clsx('w-5 h-5 rounded-xs flex items-center justify-center', isActive && 'bg-primary-50')}
							onClick={() => handleTextFormatToggle(key)}
						>
							<Icon className={isActive ? 'stroke-[#c00c0b]' : 'stroke-[#8f8f8f]'} />
						</button>
					);
				})}
			</div>
			<ToolBarDivider />

			{/* 인용구 & 구분선 버튼 */}
			<div className="flex gap-2 h-8.5">
				{quoteAndRuleButtons.map(({ key, Icon, onClick }) => {
					const isActive = key !== 'horizontalRule' && editor?.isActive(key);

					return (
						<button key={key} onClick={onClick} className="p-[7px] border border-black-300 rounded-sm">
							<Icon
								className={clsx(
									'w-5 h-5 rounded-xs',
									isActive
										? 'stroke-[#c00c0b] bg-primary-50'
										: 'stroke-[#8f8f8f] active:stroke-[#c00c0b] active:bg-primary-50',
								)}
							/>
						</button>
					);
				})}
			</div>

			<ToolBarDivider />

			{/* 미디어 버튼 */}
			<MediaButtons mediaButtonRef={mediaButtonRef} />
		</div>
	);
}
