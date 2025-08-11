'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import OptionItem from '@/components/common/option-item';
import clsx from 'clsx';
import { TeamDto } from '@/services/apis/team/dto';
import { LeagueDto } from '@/services/apis/league/dto';
import { NO_CHEERING_TEAM_PK } from '@/lib/constants';
import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';

export default function Selectbox({
	category,
	options,
	onChange,
	favoriteTeamLength,
	isEditable = true,
	isOpen = false,
}: {
	category: '리그' | '응원팀';
	options: LeagueDto[] | TeamDto[];
	onChange: (selectedOption: number | TeamDto) => void;
	favoriteTeamLength?: number;
	isEditable?: boolean;
	isOpen?: boolean;
}) {
	const [selectedOption, setSelectedOption] = useState<TeamDto | null>(null);

	const [isOptionListVisible, setIsOptionListVisible] = useState(isOpen);
	const dropboxRef = useRef<HTMLDivElement | null>(null);
	const isLeagueSelectBox = category === '리그';

	const { currentUserInfo } = useCurrentUserInfoStore();
	const { canChangeTeam } = currentUserInfo;

	const handleSelectBoxClick = () => {
		// if (!canChangeTeam) {
		// 	alert('응원팀 변경 기간이 아닙니다.');
		// 	return;
		// }
		setIsOptionListVisible(!isOptionListVisible);
	};

	const handleOptionClick = (selectedPk: number) => {
		let selectedOption = {
			pk: NO_CHEERING_TEAM_PK,
			nameKr: '응원팀이 없어요.',
			nameEn: 'no cheering team',
			logoUrl: '/ban.svg',
		};

		if (category === '리그') {
			onChange(selectedPk);
		} else {
			if (selectedPk !== NO_CHEERING_TEAM_PK) {
				selectedOption = options.find((option) => option.pk === selectedPk) as TeamDto;
				onChange(selectedOption);
			}
		}

		setSelectedOption(options.find((option) => option.pk === selectedPk));
		setIsOptionListVisible(false);
	};

	useEffect(() => {
		// props isOpen 값 변경 시마다 isOptionListVisible에 반영
		setIsOptionListVisible(isOpen);
	}, [isOpen]);

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
						${selectedOption ? 'text-black-900' : 'text-black-600'}
						${isEditable ? 'bg-black-000' : 'pointer-events-none bg-black-100'}`}
				>
					{selectedOption && (
						<Image
							className="w-[1.125rem] h-[1.125rem] object-contain"
							width={18}
							height={18}
							src={selectedOption.logoUrl}
							alt={selectedOption.nameKr}
						/>
					)}
					{selectedOption ? selectedOption.nameKr : `${isLeagueSelectBox ? '리그를' : '팀을'} 선택해 주세요.`}
					{isEditable && <Image className="ml-auto" width={16} height={16} src="/chevron/down.svg" alt="" />}
				</button>

				{isOptionListVisible && options.length > 0 && (
					<div
						className={clsx(
							'z-10 w-full top-[3.25rem] shadow-select-options border border-black-300 rounded-[0.625rem]',
							{ 'max-h-62.5 overflow-y-scroll team-scrollbar rounded-r-0': !isLeagueSelectBox },
						)}
					>
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
