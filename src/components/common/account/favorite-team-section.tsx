'use client';

import { LeagueDto } from '@/services/apis/league/dto';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { TeamDto } from '@/services/apis/team/dto';
import dynamic from 'next/dynamic';
import FavoriteTeamItem from './favorite-team-item';
import clsx from 'clsx';
import SelectSection from './select-section';

// dnd-kit 컴포넌트 hydration mismatch 가능성 존재 -> ssr 비활성화
const FavoriteTeamList = dynamic(() => import('./favorite-team-list'), {
	ssr: false,
	loading: () => (
		<div className="grid grid-cols-3 gap-2.5">
			<FavoriteTeamItem team={null} orderNum={1} isActive={false} />
			<div />
			<div />
		</div>
	),
});

export interface TeamLeagueMap {
	team: TeamDto;
	league: LeagueDto;
}

export default function FavoriteTeamSection({
	type,
	setTeams,
	initialTeams,
}: {
	type: 'signup' | 'profile-setting';
	setTeams?: Dispatch<SetStateAction<number[]>>;
	initialTeams?: TeamDto[];
}) {
	const isSignup = type === 'signup';

	const [favoriteTeams, setFavoriteTeams] = useState<(TeamDto | null)[]>([null]);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const favoriteTeamCount = favoriteTeams.filter((favorite) => favorite?.pk !== -1).length;

	// 응원팀 순서 변경 가능 여부
	const [isEditable, setIsEditable] = useState(isSignup);

	// favoriteTeams 변경될 때마다 pk 배열을 위로 전달
	useEffect(() => {
		// optional인 setTeams가 undefined이면 return
		if (!setTeams) return;

		// 응원팀까지 선택 완료한 경우만 필터링
		const teamPks = favoriteTeams.filter((team) => team?.pk);

		if (teamPks.length === 0) {
			setTeams(null);
		} else {
			const teams = teamPks.map((team) => team.pk);
			setTeams(teams);
		}
	}, [favoriteTeams, setTeams]);

	useEffect(() => {
		if (initialTeams) {
			setFavoriteTeams(initialTeams);
		}
	}, [initialTeams]);

	return (
		<div className="flex flex-col">
			<div className="subtitle1-semibold mb-2 flex items-center justify-between">
				<div>
					MY팀 {isSignup && '선택'} (<span className={clsx({ 'text-primary-900': isSignup })}>{favoriteTeamCount}</span>
					/3)
				</div>
				{!isSignup && (
					<button onClick={() => setIsEditable(true)} className="ml-auto text-button-05 font-medium text-primary-900">
						편집
					</button>
				)}
			</div>
			<div className="caption1-regular mb-6">
				* {isSignup && '최대 3순위까지 선택할 수 있으며, '}프로필에는 1순위만 표기돼요.
			</div>

			<div>
				<FavoriteTeamList
					isEditable={isEditable}
					favoriteTeams={favoriteTeams}
					setFavoriteTeams={setFavoriteTeams}
					selectedIndex={selectedIndex}
					setSelectedIndex={setSelectedIndex}
				/>
			</div>

			{isEditable && (
				<SelectSection
					selectedIndex={selectedIndex}
					favoriteTeams={favoriteTeams}
					setFavoriteTeams={setFavoriteTeams}
				/>
			)}
		</div>
	);
}
