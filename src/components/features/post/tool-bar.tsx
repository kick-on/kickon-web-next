'use client';

import clsx from 'clsx';
import { useRef, useEffect, useState } from 'react';
import { headingOptions } from '@/lib/constants/options';
import Image from 'next/image';
import useIsMobile from '@/lib/hooks/useIsMobile';
import MobileToolBar from './mobile-tool-bar';
import HeadingDropdown from './heading-drop-down';
import MediaButtons from './media-buttons';

export const ToolBarDivider = () => <div className="bg-[#E0E0E0] w-px @mobile:w-0.25 h-4.5 mx-2" />;

export default function Toolbar({
	editor,
	showLinkInput,
	setShowLinkInput,
	linkUrl,
	setLinkUrl,
	handleInsertLink,
	handleAddImage,
	handleTextFormatToggle,
	handleHeadingChange,
	showYoutubeInput,
	setShowYoutubeInput,
	youtubeUrl,
	setYoutubeUrl,
	handleInsertYoutube,
}) {
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
		{ key: 'bold', icon: <Image src="/editor/bold.svg" alt="Bold" width={20} height={20} /> },
		{ key: 'underline', icon: <Image src="/editor/underline.svg" alt="Bold" width={20} height={20} /> },
		{ key: 'italic', icon: <Image src="/editor/italic.svg" alt="Bold" width={20} height={20} /> },
		{ key: 'bulletList', icon: <Image src="/editor/ellipsis.svg" alt="Bold" width={20} height={20} /> },
		{ key: 'orderedList', icon: <Image src="/editor/sort-numeric.svg" alt="Bold" width={20} height={20} /> },
	];

	const quoteAndRuleButtons = [
		{
			key: 'blockquote',
			icon: <Image src="/editor/quote.svg" alt="인용구" width={20} height={20} />,
			onClick: () => handleTextFormatToggle('blockquote'),
		},
		{
			key: 'horizontalRule',
			icon: <Image src="/editor/line.svg" alt="구분선" width={20} height={20} />,
			onClick: () => handleTextFormatToggle('horizontalRule'),
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
			handleHeadingChange={handleHeadingChange}
			dropdownRef={dropdownRef}
			showLinkInput={showLinkInput}
			setShowLinkInput={setShowLinkInput}
			linkUrl={linkUrl}
			setLinkUrl={setLinkUrl}
			handleInsertLink={handleInsertLink}
			showYoutubeInput={showYoutubeInput}
			setShowYoutubeInput={setShowYoutubeInput}
			youtubeUrl={youtubeUrl}
			setYoutubeUrl={setYoutubeUrl}
			handleInsertYoutube={handleInsertYoutube}
			handleAddImage={handleAddImage}
			mediaButtonRef={mediaButtonRef}
			handleTextFormatToggle={handleTextFormatToggle}
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
			<div className="flex h-8.5 text-center gap-2 border border-black-300 text-[#8C8C8C] rounded-sm px-2 py-[7px]">
				{textFormatButtons.map((btn) => (
					<button
						key={btn.key}
						className={clsx('w-5 rounded-xs', editor?.isActive(btn.key) && 'bg-black-300')}
						onClick={() => handleTextFormatToggle(btn.key)}
					>
						{btn.icon}
					</button>
				))}
			</div>
			<ToolBarDivider />

			{/* 인용구 & 구분선 버튼 */}
			<div className="flex gap-2 h-8.5">
				{quoteAndRuleButtons.map((btn) => (
					<button key={btn.key} className="p-[7px] border border-black-300 rounded-sm" onClick={btn.onClick}>
						{btn.icon}
					</button>
				))}
			</div>

			<ToolBarDivider />

			{/* 미디어 버튼 */}
			<MediaButtons
				showLinkInput={showLinkInput}
				setShowLinkInput={setShowLinkInput}
				linkUrl={linkUrl}
				setLinkUrl={setLinkUrl}
				handleInsertLink={handleInsertLink}
				showYoutubeInput={showYoutubeInput}
				setShowYoutubeInput={setShowYoutubeInput}
				youtubeUrl={youtubeUrl}
				setYoutubeUrl={setYoutubeUrl}
				handleInsertYoutube={handleInsertYoutube}
				handleAddImage={handleAddImage}
				mediaButtonRef={mediaButtonRef}
			/>
		</div>
	);
}
