'use client';

import { useEffect, useRef, useState } from 'react';
import { headingOptions } from '@/lib/constants/options';
import useIsMobile from '@/lib/hooks/useIsMobile';
import { useEditorContext } from '@/lib/contexts/editor/context';
import MobileToolBar from './mobile-tool-bar';
import HeadingDropdown from './heading-drop-down';
import MediaButtons from './media-buttons';
import TextFormatButtons from '@/components/features/post/editor/text-format-buttons';
import BlockFormatButtons from '@/components/features/post/editor/block-format-buttons';

export const ToolBarDivider = () => <div className="bg-[#E0E0E0] w-px @mobile:w-0.25 h-4.5 mx-[7.5px]" />;

export default function Toolbar() {
	const {
		editor,
		isLinkInputOpen,
		setIsLinkInputOpen,
		handleHeadingChange,
		isYoutubeInputOpen,
		setIsYoutubeInputOpen,
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
	const mediaButtonRef = isLinkInputOpen ? linkInputRef : isYoutubeInputOpen ? youtubeInputRef : null;

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
				setIsLinkInputOpen(false);
			}
			// Youtube Input
			if (youtubeInputRef.current && !youtubeInputRef.current.contains(target)) {
				setIsYoutubeInputOpen(false);
			}
		};
		document.addEventListener('click', handleClickOutside);
		return () => document.removeEventListener('click', handleClickOutside);
	}, [setIsLinkInputOpen, setIsYoutubeInputOpen]);

	if (!hasMounted) return null;

	return isMobile ? (
		<MobileToolBar
			selectedOption={selectedOption}
			setSelectedOption={setSelectedOption}
			isVisibleDropdown={isVisibleDropdown}
			setIsVisibleDropdown={setIsVisibleDropdown}
			dropdownRef={dropdownRef}
			mediaButtonRef={mediaButtonRef}
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

			{/* 텍스트 포맷 버튼 */}
			<TextFormatButtons />
			<ToolBarDivider />

			{/* 블록 포맷(인용구 & 구분선) 버튼 */}
			<BlockFormatButtons />
			<ToolBarDivider />

			{/* 미디어 버튼 */}
			<MediaButtons mediaButtonRef={mediaButtonRef} />
		</div>
	);
}
