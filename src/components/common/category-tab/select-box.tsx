'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import OptionItem from '../option-item';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { LeagueDto } from '@/services/apis/league/dto';
import { getLeague } from '@/services/apis/league';

export default function Selectbox({
	q,
	type,
	isClickedOtherTab = false,
}: {
	q: string;
	type: string;
	isClickedOtherTab: boolean;
}) {
	const [isVisibleOptions, setIsVisibleOptions] = useState(false);
	const [options, setOptions] = useState<LeagueDto[] | null>(null);
	const [league, setLeague] = useState<LeagueDto | null>(null);
	const dropboxRef = useRef<HTMLDivElement | null>(null);
	const route = useRouter();

	const handleSelectBoxClick = () => {
		setIsVisibleOptions(!isVisibleOptions);
	};

	const handleOptionClick = (selectedPk: number) => {
		if (league?.pk === selectedPk) return;

		const selectedLeague = options.find((option) => option.pk === selectedPk);
		setLeague(selectedLeague);
		setIsVisibleOptions(false);

		route.push(`/news?q=${selectedLeague.nameKr}&type=league&id=${selectedLeague.pk}`);
	};

	useEffect(() => {
		const getOptions = async () => {
			const response = await getLeague();

			if (!response) {
				setOptions(null);
			} else {
				setOptions(response.data);
			}
		};

		getOptions();
	}, []);

	useEffect(() => {
		if (type === 'league' && q) {
			setLeague({
				nameKr: q,
				nameEn: q,
				pk: -1,
				logoUrl: '',
			});
		}
	}, [type, q]);

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
			setLeague(null);
		}
	}, [isClickedOtherTab]);

	return (
		<div ref={dropboxRef} className="relative flex justify-center">
			<button
				onClick={handleSelectBoxClick}
				className={clsx(
					`flex items-center gap-2 min-w-[5.625rem] pl-4 pr-1.5 pt-[1.0625rem] pb-[0.9375rem] rounded-t-[0.625rem]`,
					isClickedOtherTab
						? 'hover:text-black-900 text-black-800'
						: 'bg-black-000 shadow-[0px_4px_6px_0px_rgba(0,0,0,0.25)] header-semibold text-primary-900',
				)}
			>
				<div>{!league ? '리그 선택' : league.nameKr || league.nameEn}</div>
				<Image width={16} height={16} src="/chevron/down.svg" alt="리그 선택" />
			</button>
			{isVisibleOptions && (
				<div
					className="absolute z-10 w-[12.5rem] top-13 left-0 @mobile:w-max @mobile:right-0
						shadow-select-options border border-black-200 rounded-[0.625rem]"
				>
					{!options
						? null
						: options.map((league, index) => (
								<div
									key={league.pk}
									className={clsx('w-full bg-black-000 hover:bg-black-200 transition-colors', {
										'rounded-t-[0.5625rem]': index === 0,
										'rounded-b-[0.5625rem]': index === options.length - 1,
									})}
								>
									<OptionItem onClick={handleOptionClick} {...league} />
									{index < options.length - 1 && <hr className="border-black-200" />}
								</div>
							))}
				</div>
			)}
		</div>
	);
}
