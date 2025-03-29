'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import OptionItem from '../../../common/option-item';
import clsx from 'clsx';
import { LeagueDto } from '@/services/apis/league/dto';
import { getLeague } from '@/services/apis/league';

export default function SelectBox({
	content,
	onChange,
}: {
	content: string;
	onChange: (selectedLeague: LeagueDto) => void;
}) {
	const [options, setOptions] = useState<LeagueDto[] | null>();
	const [isVisibleOptions, setIsVisibleOptions] = useState(false);
	const dropboxRef = useRef<HTMLDivElement | null>(null);

	const handleSelectBoxClick = () => {
		setIsVisibleOptions(!isVisibleOptions);
	};

	const handleOptionClick = (selectedPk: number) => {
		const selectedLeague = options.find((option) => option.pk === selectedPk);
		onChange(selectedLeague);
		setIsVisibleOptions(false);
	};

	useEffect(() => {
		const getOptions = async () => {
			const response = await getLeague();

			if (!response) return;
			setOptions(response.data);
		};

		getOptions();
	}, []);

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

	return (
		<div ref={dropboxRef} className="relative w-fit">
			<button onClick={handleSelectBoxClick} className="flex gap-2 items-center ml-2">
				<div>{content}</div>
				<Image width={16} height={16} src="/chevron/down.svg" alt="리그 선택" />
			</button>
			{isVisibleOptions && (
				<div className="absolute w-[12.5rem] top-6 shadow-select-options border border-black-200 rounded-[0.625rem]">
					{options.map((option, index) => (
						<div
							key={option.pk}
							className={clsx('bg-black-000 hover:bg-black-200 transition-colors', {
								'rounded-t-[0.5625rem]': index === 0,
								'rounded-b-[0.5625rem]': index === options.length - 1,
							})}
						>
							<OptionItem onClick={handleOptionClick} {...option} />
							{index < options.length - 1 && <hr className="border-black-200" />}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
