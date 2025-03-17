'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import OptionItem from '../option-item';
import clsx from 'clsx';
import { leagues } from '@/lib/constants/leagues';
import { useRouter } from 'next/navigation';

export default function SelectBox({ isClickedOtherTab = false }: { isClickedOtherTab: boolean }) {
	const [isVisibleOptions, setIsVisibleOptions] = useState(false);
	const [league, setLeague] = useState('리그 선택');
	const dropboxRef = useRef<HTMLDivElement | null>(null);
	const route = useRouter();

	const handleSelectBoxClick = () => {
		setIsVisibleOptions(!isVisibleOptions);
	};

	const handleOptionClick = (selectedLeague: string) => {
		setLeague(selectedLeague);
		setIsVisibleOptions(false);
		route.push(`/news?q=${selectedLeague}`);
	};

	useEffect(() => {
		// isVisibleOptions가 true일 때만 리스너 등록
		if (!isVisibleOptions) return;

		// 드롭박스 외부 클릭 시 닫음
		const handleOutsideClick = (e: MouseEvent) => {
			if (!dropboxRef.current.contains(e.target as Node)) {
				setIsVisibleOptions(false);
			}
		};

		document.addEventListener('click', handleOutsideClick);
		return () => {
			document.removeEventListener('click', handleOutsideClick);
		};
	}, [isVisibleOptions]);

	useEffect(() => {
		if (isClickedOtherTab) {
			setLeague('리그 선택');
		}
	}, [isClickedOtherTab]);

	return (
		<div ref={dropboxRef} className="relative w-fit">
			<button onClick={handleSelectBoxClick} className="flex gap-2 items-center px-[0.5625rem] py-[0.9375rem]">
				<div>{league}</div>
				<Image width={16} height={16} src="/chevron/down.svg" alt="리그 선택" />
			</button>
			{isVisibleOptions && (
				<div className="absolute w-[12.5rem] top-[2.4rem] shadow-select-options border border-black-200 rounded-[0.625rem]">
					{leagues.map((league, index) => (
						<div
							key={league.content}
							className={clsx('bg-black-000 hover:bg-black-200 transition-colors', {
								'rounded-t-[0.5625rem]': index === 0,
								'rounded-b-[0.5625rem]': index === leagues.length - 1,
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
