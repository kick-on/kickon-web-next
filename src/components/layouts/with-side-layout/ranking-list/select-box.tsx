'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import OptionItem from './option-item';
import clsx from 'clsx';

export default function SelectBox() {
	const [isVisibleOptions, setIsVisibleOptions] = useState(false);
	const [league, setLeague] = useState('K리그 1');

	const leagues = [
		{
			league: '프리미어 리그',
			src: '/league-logo/premier-league.svg',
		},
		{
			league: '라리가',
			src: '/league-logo/la-liga.svg',
		},
		{
			league: '분데스리가',
			src: '/league-logo/bundesliga.svg',
		},
		{
			league: '세리에 A',
			src: '/league-logo/serie-a.svg',
		},
		{
			league: '리그앙',
			src: '/league-logo/ligue-1.svg',
		},
		{
			league: 'K리그 1',
			src: '/league-logo/k-league.svg',
		},
		{
			league: 'K리그 2',
			src: '/league-logo/k-league.svg',
		},
	];

	const handleSelectBoxClick = () => {
		setIsVisibleOptions(!isVisibleOptions);
	};

	const handleOptionClick = (selectedLeague: string) => {
		setLeague(selectedLeague);
		setIsVisibleOptions(false);
	};

	// 드롭박스 외부 클릭 시 닫음
	const handleOutsideClick = (event: MouseEvent) => {
		const target = event.target as HTMLElement;
		if (!target.closest('.relative')) {
			setIsVisibleOptions(false);
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleOutsideClick);
		return () => {
			document.removeEventListener('mousedown', handleOutsideClick);
		};
	}, []);

	return (
		<div className="relative w-fit">
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
