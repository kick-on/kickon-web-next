'use client';

import { Dispatch, SetStateAction } from 'react';
import FavoriteTeamItem from './favorite-team-item';
import Image from 'next/image';
import { TeamLeagueMap } from './favorite-team-section';

export default function FavoriteTeamList({
	favoriteTeamLeagueMap,
	setFavoriteTeamLeagueMap,
	selectedTeamIndex,
	setSelectedTeamIndex,
	clearSelectbox,
}: {
	favoriteTeamLeagueMap: (TeamLeagueMap | null)[];
	setFavoriteTeamLeagueMap: Dispatch<SetStateAction<TeamLeagueMap[]>>;
	selectedTeamIndex: number;
	setSelectedTeamIndex: Dispatch<SetStateAction<number>>;
	clearSelectbox: () => void;
}) {
	// favorite team item 추가 버튼 클릭 핸들러
	const handleAddButtonClick = () => {
		setFavoriteTeamLeagueMap([...favoriteTeamLeagueMap, null]);
		setSelectedTeamIndex(favoriteTeamLeagueMap.length);
		clearSelectbox();
	};

	// favorite team item 내부 x 버튼 클릭 핸들러
	const handleXButtonClick = (e: React.MouseEvent, index: number) => {
		e.stopPropagation();

		// 모두 삭제 시 favoriteTeamLeagueMap를 [null]로 설정하여 추가 버튼이 생성되지 않도록 함
		const newFavoriteTeamLeagueMap = favoriteTeamLeagueMap.filter((_, i) => i !== index);
		setFavoriteTeamLeagueMap(newFavoriteTeamLeagueMap.length ? newFavoriteTeamLeagueMap : [null]);

		// 현재 선택된 팀을 삭제할 경우 첫 번째 요소나 마지막 요소를 active
		if (selectedTeamIndex === index) {
			const newSelectedTeamIndex = index === 0 ? 0 : newFavoriteTeamLeagueMap.length - 1;
			setSelectedTeamIndex(newSelectedTeamIndex);
		} else {
			// 그 외 기존 요소에 대한 active 유지
			const selectedMap = favoriteTeamLeagueMap[selectedTeamIndex];
			const newSelectedTeamIndex = newFavoriteTeamLeagueMap.indexOf(selectedMap);
			setSelectedTeamIndex(newSelectedTeamIndex);
		}
	};

	return (
		<div className="grid grid-cols-3 gap-2.5 items-end">
			{favoriteTeamLeagueMap.map((favorite, i) => (
				<FavoriteTeamItem
					key={favorite?.team?.pk ?? -1}
					orderNum={i + 1}
					team={favorite?.team}
					isActive={selectedTeamIndex === i}
					onClickItem={() => setSelectedTeamIndex(i)}
					onClickXButton={(e) => handleXButtonClick(e, i)}
				/>
			))}
			{favoriteTeamLeagueMap.at(-1) !== null && favoriteTeamLeagueMap.length < 3 && (
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
