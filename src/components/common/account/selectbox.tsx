'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import OptionItem from '@/components/common/option-item';
import clsx from 'clsx';
import { getLeague } from '@/services/apis/league';
import { getTeam } from '@/services/apis/team';
import { TeamDto } from '@/services/apis/team/dto';
import { LeagueDto } from '@/services/apis/league/dto';
import { NO_CHEERING_TEAM_PK } from '@/lib/constants';

export default function Selectbox({
	category,
	favoriteTeamLength,
	league,
	content,
	onChange,
	isEditable = true,
	isOpen = false,
}: {
	category: '리그' | '응원팀';
	favoriteTeamLength?: number;
	league?: number;
	content: LeagueDto | TeamDto;
	onChange: (selectedOption: LeagueDto | TeamDto) => void;
	isEditable?: boolean;
	isOpen?: boolean;
}) {
	const [isOptionListVisible, setIsOptionListVisible] = useState(isOpen);
	const [options, setOptions] = useState<LeagueDto[] | TeamDto[]>([]);
	const dropboxRef = useRef<HTMLDivElement | null>(null);
	const isLeagueSelectBox = category === '리그';

	const handleSelectBoxClick = () => {
		setIsOptionListVisible(!isOptionListVisible);
	};

	const handleOptionClick = (selectedPk: number) => {
		let selectedOption = {
			pk: NO_CHEERING_TEAM_PK,
			nameKr: '응원팀이 없어요.',
			nameEn: 'no cheering team',
			logoUrl: '/ban.svg',
		};

		if (selectedPk !== NO_CHEERING_TEAM_PK) {
			if (category === '리그') {
				const selectedLeague = options.find((option) => option.pk === selectedPk) as LeagueDto;
				selectedOption = {
					pk: selectedLeague.pk,
					nameKr: selectedLeague.nameKr,
					nameEn: selectedLeague.nameEn,
					logoUrl: selectedLeague.logoUrl,
				};
			} else {
				selectedOption = options.find((option) => option.pk === selectedPk) as TeamDto;
			}
		}

		console.log(selectedOption);
		onChange(selectedOption);
		setIsOptionListVisible(false);
	};

	useEffect(() => {
		// props isOpen 값 변경 시마다 isOptionListVisible에 반영
		setIsOptionListVisible(isOpen);
	}, [isOpen]);

	useEffect(() => {
		const getOptions = async () => {
			const response = isLeagueSelectBox ? await getLeague() : await getTeam(league);

			if (!response) return;
			setOptions(response.data);
		};

		getOptions();
	}, [isLeagueSelectBox, league]);

	useEffect(() => {
		// isOptionListVisible가 true일 때만 리스너 등록
		if (!isOptionListVisible) return;

		// 드롭박스 외부 클릭 시 닫음
		const handleOutsideClick = (e: MouseEvent) => {
			if (!dropboxRef.current.contains(e.target as Node)) {
				setIsOptionListVisible(false);
			}
		};

		document.addEventListener('click', handleOutsideClick);
		return () => {
			document.removeEventListener('click', handleOutsideClick);
		};
	}, [isOptionListVisible]);

	return (
		<div className="flex flex-col gap-2">
			<div ref={dropboxRef} className="w-full flex flex-col gap-1">
				<button
					onClick={handleSelectBoxClick}
					className={`flex gap-2.5 items-center px-4 py-3 w-full
						border border-black-300 rounded-lg body3-regular @mobile:text-14
						${content ? 'text-black-900' : 'text-black-600'}
						${isEditable ? 'bg-black-000' : 'pointer-events-none bg-black-100'}`}
				>
					{content && (
						<Image
							className="w-[1.125rem] h-[1.125rem] object-contain"
							width={18}
							height={18}
							src={content.logoUrl}
							alt={content.nameKr}
						/>
					)}
					{content ? content.nameKr : `${isLeagueSelectBox ? '리그를' : '팀을'} 선택해 주세요.`}
					{isEditable && (
						<Image className="ml-auto" width={16} height={16} src="/chevron/down.svg" alt={`${category} 선택`} />
					)}
				</button>

				{isOptionListVisible && !!options.length && (
					<div className="z-10 w-full top-[3.25rem] shadow-select-options border border-black-300 rounded-[0.625rem]">
						{options.map((option, index) => (
							<div
								key={option.pk}
								className={clsx('bg-black-000 hover:bg-black-150 transition-colors', {
									'rounded-t-[0.5625rem]': index === 0,
									'rounded-b-[0.5625rem]': index === options.length - 1 && !isLeagueSelectBox,
								})}
							>
								<OptionItem onClick={handleOptionClick} {...option} />
								{index < options.length - 1 && <hr className="border-black-300" />}
							</div>
						))}
						{isLeagueSelectBox && favoriteTeamLength === 1 && (
							<div
								className="bg-black-000 hover:bg-black-150 transition-colors
									rounded-b-[0.5625rem] border-t border-black-300"
							>
								<OptionItem onClick={handleOptionClick} pk={-1} nameKr="응원팀이 없어요." logoUrl="/ban.svg" />
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
