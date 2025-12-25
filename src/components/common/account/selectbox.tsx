'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import OptionItem, { Option } from '@/components/common/option-item';
import clsx from 'clsx';
import { TeamDto } from '@/services/apis/team/team.type';
import { LeagueDto } from '@/services/apis/league/league.type';
import { NO_CHEERING_TEAM_PK } from '@/lib/constants/noCheeringTeam';
import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import AlertModal from '@/components/features/detail/alert-modal';
import { separateMonthAndDay } from '@/lib/utils';
import ChevronIcon from '@/assets/common/chevron/down.svg';

export default function Selectbox({
	category,
	options,
	content,
	onChange,
	favoriteTeams,
	isEditable = true,
	isDropdownOpen = false,
	setIsDropdownOpen,
}: {
	category: '리그' | '응원팀';
	options: LeagueDto[] | TeamDto[];
	content: Option | null;
	onChange: (selectedOption: number | TeamDto) => void;
	favoriteTeams: TeamDto[];
	isEditable?: boolean;
	isDropdownOpen?: boolean;
	setIsDropdownOpen?: (isOpen: boolean) => void;
}) {
	const dropboxRef = useRef<HTMLDivElement | null>(null);
	const isLeagueSelectBox = category === '리그';

	// 리그-팀 공통으로 pk, nameKr, logoUrl 사용
	const [selectedOption, setSelectedOption] = useState<Option | null>(null);

	useEffect(() => {
		setSelectedOption(content);
	}, [content]);

	const { currentUserInfo } = useCurrentUserInfoStore();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const nextChangeDate = separateMonthAndDay(currentUserInfo?.nextAvailableChangeDate);
	const nextChangeDateElement =
		typeof nextChangeDate === 'string' ? (
			<span className="text-primary-900">{nextChangeDate}</span>
		) : (
			nextChangeDate.map(({ label, value }) => (
				<span key={label}>
					<span className="text-primary-900">{value}</span>
					{label}
					{label === '월' && <>&nbsp;</>}
				</span>
			))
		);

	const handleSelectBoxClick = () => {
		if (currentUserInfo && !currentUserInfo.canChangeTeam) {
			setIsModalOpen(true);
			return;
		}
		setIsDropdownOpen(!isDropdownOpen);
	};

	const handleOptionClick = (selectedPk: number) => {
		const selected = options.find((option) => option.pk === selectedPk) ?? {
			pk: -1,
			nameKr: '응원팀이 없어요',
			nameEn: 'no cheering team',
			logoUrl: '/ban.svg',
		};

		if (isLeagueSelectBox) {
			onChange(selectedPk);
		} else {
			// 기존과 동일한 팀을 선택한 경우
			if (selectedOption && selectedOption.pk === selectedPk) {
				setIsDropdownOpen(false);
				return;
			}

			// 이미 선택한 팀을 선택한 경우
			if (favoriteTeams.find((team) => team?.pk === selectedPk)) {
				alert('이미 선택한 팀입니다.');
				return;
			}

			// 유의미한 팀을 선택한 경우
			if (selectedPk !== NO_CHEERING_TEAM_PK) {
				onChange(selected);
			}
		}

		setSelectedOption(selected);
		setIsDropdownOpen(false);
	};

	useEffect(() => {
		// isDropdownOpen가 true일 때만 리스너 등록
		if (!isDropdownOpen) return;

		// 드롭박스 외부 클릭 시 닫음
		const handleOutsideClick = (e: MouseEvent) => {
			if (!dropboxRef.current.contains(e.target as Node)) {
				setIsDropdownOpen(false);
			}
		};

		document.addEventListener('click', handleOutsideClick);
		return () => {
			document.removeEventListener('click', handleOutsideClick);
		};
	}, [isDropdownOpen]);

	return (
		<div className="flex flex-col gap-2">
			<div ref={dropboxRef} className="w-full flex flex-col gap-1">
				<button
					onClick={handleSelectBoxClick}
					className={`flex gap-2.5 items-center px-4 py-3 w-full
						border border-black-300 rounded-lg text-body-03 @mobile:text-body-05
						${selectedOption ? 'text-black-900' : 'text-black-600'}
						${isEditable ? 'bg-black-000' : 'pointer-events-none bg-black-100'}`}
				>
					{selectedOption && (
						<Image
							className="w-[1.125rem] h-[1.125rem] object-contain"
							width={18}
							height={18}
							src={selectedOption.logoUrl}
							alt=""
						/>
					)}
					{selectedOption ? selectedOption.nameKr : `${isLeagueSelectBox ? '리그를' : '팀을'} 선택해 주세요.`}
					{isEditable && <ChevronIcon className="ml-auto" width={16} height={16} />}
				</button>

				{isDropdownOpen && options.length > 0 && (
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
						{isLeagueSelectBox && favoriteTeams.length === 1 && (
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

			{isModalOpen && (
				<AlertModal
					type="alert"
					description={
						<>
							MY팀 변경은 6개월에 한 번만 가능해요.
							<br />
							다음 변경 가능일: {nextChangeDateElement}
						</>
					}
					confirmButtonText="확인"
					onConfirm={() => setIsModalOpen(false)}
				/>
			)}
		</div>
	);
}
