'use client';

import clsx from 'clsx';
import { useRef, useEffect, useState } from 'react';
import { BiLinkAlt, BiImageAlt, BiVideo } from 'react-icons/bi';
import ImageIcon from 'next/image';
import { headingOptions } from '@/lib/constants/options';

export default function Toolbar({
	editor,
	showLinkInput,
	setShowLinkInput,
	linkUrl,
	setLinkUrl,
	handleInsertLink,
	handleAddImage,
	handleFormatToggle,
	handleHeadingChange,
	showYoutubeInput,
	setShowYoutubeInput,
	youtubeUrl,
	setYoutubeUrl,
	handleInsertYoutube,
}) {
	const [isVisibleDropdown, setIsVisibleDropdown] = useState(false);
	const [selectedOption, setSelectedOption] = useState(headingOptions[0]);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const toolbarButtons = [
		{ key: 'bold', icon: 'B' },
		{ key: 'underline', icon: 'U' },
		{ key: 'italic', icon: 'I' },
		{ key: 'bulletList', icon: '.' },
		{ key: 'orderedList', icon: '1.' },
		{ key: 'blockquote', icon: 'Q' },
		{ key: 'horizontalRule', icon: 'ㅡ' },
	];

	const mediaButtons = [
		{ key: 'link', icon: <BiLinkAlt />, onClick: () => setShowLinkInput((prev) => !prev), isLabel: false },
		{ key: 'image', icon: <BiImageAlt />, onChange: handleAddImage, accept: 'image/*', isLabel: true },
		{ key: 'youtube', icon: <BiVideo />, onClick: () => setShowYoutubeInput((prev) => !prev), isLabel: false },
	];

	// 홈 드롭다운 코드 참고

	const handleDropdownToggle = () => {
		setIsVisibleDropdown((prev) => !prev);
	};

	const handleOptionClick = (option) => {
		setSelectedOption(option);
		setIsVisibleDropdown(false);
		handleHeadingChange(option.value);
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsVisibleDropdown(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	return (
		<div className="flex flex-wrap items-center gap-2 pb-4">
			<div ref={dropdownRef} className="relative w-fit">
				<button
					onClick={handleDropdownToggle}
					className="flex items-center gap-1.5 px-2 py-[9px] border border-[#D9D9D9] rounded-sm"
				>
					<div className="text-[#8C8C8C] body5-regular">{selectedOption.label}</div>
					<ImageIcon width={16} height={16} src="/chevron/down.svg" alt="옵션 선택" />
				</button>
				{isVisibleDropdown && (
					<div className="z-50 absolute top-10 w-[63px] bg-white border border-gray-300 rounded-sm shadow-sm">
						{headingOptions.map((option, index) => (
							<div
								key={option.value}
								className={clsx('p-2 body5-regular cursor-pointer hover:bg-gray-200 transition-colors', {
									'rounded-t-sm': index === 0,
									'rounded-b-sm': index === headingOptions.length - 1,
								})}
								onClick={() => handleOptionClick(option)}
							>
								{option.label}
							</div>
						))}
					</div>
				)}
			</div>

			<div className="text-[#E0E0E0] px-2"> | </div>

			<div className="flex text-center gap-2 border border-[#D9D9D9] text-[#8C8C8C] rounded-sm px-2 py-[7px]">
				{toolbarButtons.map((btn) => (
					<button
						key={btn.key}
						className={clsx('w-5 h-5 px-2 rounded-sm', editor?.isActive(btn.key) && 'bg-gray-300')}
						onClick={() => handleFormatToggle(btn.key)}
					>
						{btn.icon}
					</button>
				))}
			</div>

			<div className="text-[#E0E0E0] px-2"> | </div>

			<div className="relative flex gap-2">
				{mediaButtons.map((btn) =>
					btn.isLabel ? (
						<label key={btn.key} className="cursor-pointer p-[7px] border border-[#D9D9D9] rounded-sm">
							{btn.icon}
							<input type="file" accept={btn.accept} className="hidden" onChange={btn.onChange} />
						</label>
					) : (
						<button key={btn.key} className="p-[7px] border border-[#D9D9D9] rounded-sm relative" onClick={btn.onClick}>
							{btn.icon}
						</button>
					),
				)}

				{showLinkInput && (
					<div className="absolute top-full left-0 mt-2 flex gap-2 w-60 h-10 bg-black-000 px-2 border border-black-300 rounded-lg shadow-md z-50">
						<input
							className="flex-1 p-2 focus:outline-none"
							type="text"
							placeholder="URL을 입력하세요."
							value={linkUrl}
							onChange={(e) => setLinkUrl(e.target.value)}
						/>

						<button
							className="button4-medium bg-black-000 text-black-600 border border-black-300 px-3 py-1 rounded-lg shadow-md whitespace-nowrap flex items-center hover:bg-black-200"
							onClick={() => {
								handleInsertLink();
								setShowLinkInput(false);
								setLinkUrl('');
							}}
						>
							저장
						</button>
					</div>
				)}

				{showYoutubeInput && (
					<div className="absolute top-full left-0 mt-2 flex gap-2 w-60 h-10 bg-black-000 px-2 border border-black-300 rounded-lg shadow-md z-50">
						<input
							className="flex-1 p-2 focus:outline-none"
							type="text"
							placeholder="유튜브 링크를 입력하세요."
							value={youtubeUrl}
							onChange={(e) => setYoutubeUrl(e.target.value)}
						/>
						<button
							className="button4-medium bg-black-000 text-black-600 border border-black-300 px-3 py-1 rounded-lg shadow-md whitespace-nowrap flex items-center hover:bg-black-200"
							onClick={handleInsertYoutube}
						>
							업로드
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
