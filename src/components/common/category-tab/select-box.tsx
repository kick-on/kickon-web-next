'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import OptionItem from '../option-item';
import clsx from 'clsx';
import { usePathname, useRouter } from 'next/navigation';
import { LeagueDto } from '@/services/apis/league/dto';
import { getLeague } from '@/services/apis/league';
import useIsMobile from '@/lib/hooks/useIsMobile';

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
	const pathname = usePathname();
	const router = useRouter();

	const isMobile = useIsMobile();

	const handleSelectBoxClick = () => {
		setIsVisibleOptions(!isVisibleOptions);
	};

	const handleOptionClick = (selectedPk: number) => {
		if (league?.pk === selectedPk) return;

		const selectedLeague = options.find((option) => option.pk === selectedPk);

		router.push(`${pathname}?q=${selectedLeague.nameKr}&type=league&id=${selectedLeague.pk}`);
		setLeague(selectedLeague);
		setIsVisibleOptions(false);
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
		if (type === 'league' && q && options) {
			const selectedLeague = options.find((option) => option.nameKr === q);
			setLeague(selectedLeague);
		}
	}, [type, q, options]);

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

	if (isMobile === null) return;

	return (
		<div ref={dropboxRef} className="relative grow">
			<button
				onClick={handleSelectBoxClick}
				className={clsx(
					`flex items-center justify-center gap-2 h-full min-w-[5.625rem] @mobile:w-full
					pl-4 @mobile:pl-3 pr-1.5 rounded-t-[0.625rem]`,
					isClickedOtherTab
						? 'hover:text-black-900 text-black-700'
						: 'bg-black-000 shadow-[0px_4px_6px_0px_rgba(0,0,0,0.25)] header-semibold text-primary-900',
				)}
			>
				{isMobile ? (
					league ? (
						<Image className="w-8 h-8 object-contain" src={league.logoUrl} alt="로고" width={32} height={32} />
					) : (
						<div>리그 선택</div>
					)
				) : (
					<div>{!league ? '리그 선택' : league.nameKr || league.nameEn}</div>
				)}
				<Image width={16} height={16} src="/chevron/down.svg" alt="리그 선택" />
			</button>
			{isVisibleOptions && (
				<div
					className="absolute z-10 w-[12.5rem] top-13 @not-mobile:left-0 @mobile:right-4 @mobile:w-max
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
