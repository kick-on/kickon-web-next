'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import OptionItem from '../option-item';
import clsx from 'clsx';
import { leagues } from '@/lib/constants/leagues';

export default function SelectBox({ category, options, content, onChange }) {
	const [isVisibleOptions, setIsVisibleOptions] = useState(false);
	const dropboxRef = useRef<HTMLDivElement | null>(null);
	const isLeagueSelectBox = category === '리그';

	const handleSelectBoxClick = () => {
		setIsVisibleOptions(!isVisibleOptions);
	};

	const handleOptionClick = (selectedOption: string) => {
		onChange(selectedOption);
		setIsVisibleOptions(false);
	};

	useEffect(() => {
		// 드롭박스 외부 클릭 시 닫음
		const handleOutsideClick = (e: MouseEvent) => {
			if (isVisibleOptions && !dropboxRef.current.contains(e.target as Node)) {
				setIsVisibleOptions(false);
			}
		};

		document.addEventListener('mousedown', handleOutsideClick);
		return () => {
			document.removeEventListener('mousedown', handleOutsideClick);
		};
	}, [isVisibleOptions]);

	return (
		<div className="flex flex-col gap-2">
			<div className="flex gap-1.5 items-center subtitle1-medium">
				{category}
				{isLeagueSelectBox && (
					<Image width={12} height={12} src="/help-circle.svg" alt="도움말" className="cursor-pointer" />
				)}
			</div>

			<div ref={dropboxRef} className="w-full flex flex-col gap-1">
				<button
					onClick={handleSelectBoxClick}
					className={`flex gap-2.5 items-center px-4 py-3 w-full
						border border-black-300 rounded-lg bg-black-000 body3-regular
						${content ? 'text-black-900' : 'text-black-600'}`}
				>
					{content && <Image width={18} height={18} src="/league-logo/premier-league.svg" alt={content} />}
					{content || '선택해 주세요.'}
					<Image className="ml-auto" width={16} height={16} src="/chevron/down.svg" alt={`${category} 선택`} />
				</button>

				{isVisibleOptions && (
					<div className="z-10 w-full top-[3.25rem] shadow-select-options border border-black-300 rounded-[0.625rem]">
						{options.map((option, index) => (
							<div
								key={option.content}
								className={clsx('bg-black-000 hover:bg-black-150 transition-colors', {
									'rounded-t-[0.5625rem]': index === 0,
									'rounded-b-[0.5625rem]': index === leagues.length - 1 && isLeagueSelectBox,
								})}
							>
								<OptionItem onClick={handleOptionClick} {...option} />
								{index < leagues.length - 1 && <hr className="border-black-300" />}
							</div>
						))}
						{!isLeagueSelectBox && (
							<div
								className="bg-black-000 hover:bg-black-150 transition-colors
									rounded-b-[0.5625rem] border-t border-black-300"
							>
								<OptionItem onClick={handleOptionClick} content="응원팀이 없어요." src="/ban.svg" />
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
