'use client';

import { TeamDto } from '@/services/apis/team/dto';
import { Dispatch, SetStateAction, useState } from 'react';
import FavoriteTeamItem from './favorite-team-item';
import Image from 'next/image';

export default function FavoriteTeamList({
	favoriteTeams,
	setFavoriteTeams,
}: {
	favoriteTeams: (TeamDto | null)[];
	setFavoriteTeams: Dispatch<SetStateAction<TeamDto[]>>;
}) {
	const [selectedTeamIndex, setSelectedTeamIndex] = useState(0);

	// favorite team item 추가 버튼 클릭 핸들러
	const handleAddButtonClick = () => {
		setFavoriteTeams([...favoriteTeams, null]);
		setSelectedTeamIndex(favoriteTeams.length);
	};

	// favorite team item 내부 x 버튼 클릭 핸들러
	const handleXButtonClick = (e: React.MouseEvent, index: number) => {
		e.stopPropagation();

		// 모두 삭제 시 favoriteTeams를 [null]로 설정하여 추가 버튼이 생성되지 않도록 함
		const newFavoriteTeams = favoriteTeams.filter((_, i) => i !== index);
		setFavoriteTeams(newFavoriteTeams.length ? newFavoriteTeams : [null]);

		// 현재 선택된 팀을 삭제할 경우 첫 번째 요소나 마지막 요소를 active
		if (selectedTeamIndex === index) {
			const newSelectedTeamIndex = index === 0 ? 0 : newFavoriteTeams.length - 1;
			setSelectedTeamIndex(newSelectedTeamIndex);
		} else {
			// 그 외 기존 요소에 대한 active 유지
			const selectedTeam = favoriteTeams[selectedTeamIndex];
			const newSelectedTeamIndex = newFavoriteTeams.indexOf(selectedTeam);
			setSelectedTeamIndex(newSelectedTeamIndex);
		}
	};

	return (
		<div className="grid grid-cols-3 gap-2.5 items-end">
			{favoriteTeams.map((team, i) => (
				<FavoriteTeamItem
					key={team?.pk ?? -1}
					orderNum={i + 1}
					team={team}
					isActive={selectedTeamIndex === i}
					onClickItem={() => setSelectedTeamIndex(i)}
					onClickXButton={(e) => handleXButtonClick(e, i)}
				/>
			))}
			{favoriteTeams.at(-1) !== null && favoriteTeams.length < 3 && (
				// 이전 팀 선택이 완료되고 선택 팀이 3개 미만일 때 추가 버튼 표시
				<button
					onClick={handleAddButtonClick}
					className="w-full h-auto aspect-[5/4] flex flex-col gap-1 justify-center items-center 
          rounded-lg bg-black-000 p-[5px] border border-black-300"
				>
					<div className="relative w-12 h-12 @mobile:w-[2.1875rem] @mobile:h-[2.1875rem]">
						<Image src={'/plus.svg'} alt="팀 추가 버튼" fill className="w-auto h-auto" />
					</div>
				</button>
			)}
		</div>
	);
}
