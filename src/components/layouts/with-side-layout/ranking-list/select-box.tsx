'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import OptionItem from './option-item';
import clsx from 'clsx';
import { leagues } from '@/lib/constants/leagues';

export default function SelectBox() {
	const [isVisibleOptions, setIsVisibleOptions] = useState(false);
	const [league, setLeague] = useState('K리그 1');
	const dropboxRef = useRef<HTMLDivElement | null>(null);

	const handleSelectBoxClick = () => {
		setIsVisibleOptions(!isVisibleOptions);
	};

	const handleOptionClick = (selectedLeague: string) => {
		setLeague(selectedLeague);
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
		<div ref={dropboxRef} className="relative w-fit">
			<button onClick={handleSelectBoxClick} className="flex gap-2 items-center ml-2">
				<div className="button4-medium">{league}</div>
				<Image width={16} height={16} src="/chevron/down.svg" alt="리그 선택" />
			</button>
			{isVisibleOptions && (
				<div className="absolute w-[12.5rem] top-6 shadow-select-options border border-black-200 rounded-[0.625rem]">
					{leagues.map((league, index) => (
						<div
							key={league.league}
							className={clsx('bg-black-000 hover:bg-black-200 transition-colors', {
								'rounded-t-[0.625rem]': index === 0,
								'rounded-b-[0.625rem]': index === leagues.length - 1,
							})}
						>
							<OptionItem onClick={handleOptionClick} {...league} />
							{index < leagues.length - 1 && <hr className="border-black-200" />}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
