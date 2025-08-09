'use client';

import { LeagueDto } from '@/services/apis/league/dto';
import Selectbox from './selectbox';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { TeamDto } from '@/services/apis/team/dto';
import { NO_CHEERING_TEAM_PK } from '@/lib/constants';
import dynamic from 'next/dynamic';
import FavoriteTeamItem from './favorite-team-item';
import clsx from 'clsx';

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
	canChangeTeam,
	setTeams,
	initialTeams,
}: {
	type: 'signup' | 'profile-setting';
	canChangeTeam?: boolean; // 응원팀(값) 변경 가능 여부
	setTeams?: Dispatch<SetStateAction<number[]>>;
	initialTeams?: TeamDto[];
}) {
	const isSignup = type === 'signup';

	const [favoriteTeamLeagueMap, setFavoriteTeamLeagueMap] = useState<(TeamLeagueMap | null)[]>([null]);
	const [selectedTeamIndex, setSelectedTeamIndex] = useState(0);
	const favoriteTeamCount = favoriteTeamLeagueMap.filter(({ team }) => team.pk !== -1).length;

	const [league, setLeague] = useState<LeagueDto | null>(null);
	const [team, setTeam] = useState<TeamDto | null>(null);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	// 응원팀 순서 변경 가능 여부
	const [isEditable, setIsEditable] = useState(isSignup);

	// 다른 순위의 팀을 선택했을 때마다 실행 (ex. 1순위 팀 -> 2순위 팀)
	useEffect(() => {
		const selectedMap = favoriteTeamLeagueMap[selectedTeamIndex];
		setLeague(selectedMap?.league ?? null);
		setTeam(selectedMap?.team ?? null);
	}, [selectedTeamIndex, favoriteTeamLeagueMap]);

	const handleLeagueChange = (selectedLeague: LeagueDto) => {
		if (!canChangeTeam) {
			alert('응원팀 변경 불가가');
		}

		// 응원팀이 없는 상태 -> 다른 리그를 선택한 경우
		if (league?.pk === NO_CHEERING_TEAM_PK) {
			setTeam(null);
		}

		// 응원팀이 없어요를 선택한 경우
		if (selectedLeague.pk === NO_CHEERING_TEAM_PK) {
			const newFavoriteTeamLeagueMap = favoriteTeamLeagueMap.map((favorite, i) =>
				i === selectedTeamIndex ? { team: selectedLeague, league: selectedLeague } : favorite,
			);
			setFavoriteTeamLeagueMap(newFavoriteTeamLeagueMap);
		}

		setLeague(selectedLeague);
		setIsDropdownOpen(true); // 리그 선택 시 팀 선택 드롭다운 자동 오픈
	};

	const handleTeamChange = (selectedTeam: TeamDto) => {
		if (!canChangeTeam) {
			alert('응원팀 변경 불가');
		}

		// 이미 선택한 팀이면 alert
		const favoriteTeamPks = favoriteTeamLeagueMap.map((favorite) => favorite?.team?.pk);
		if (favoriteTeamPks.includes(selectedTeam.pk)) {
			alert('이미 선택된 팀입니다.');
			return;
		}

		const newFavoriteTeamLeagueMap = favoriteTeamLeagueMap.map((favorite, i) =>
			i === selectedTeamIndex ? { league, team: selectedTeam } : favorite,
		);

		setFavoriteTeamLeagueMap(newFavoriteTeamLeagueMap);
		setTeam(selectedTeam);
		setIsDropdownOpen(false);
	};

	const clearSelectbox = () => {
		setLeague(null);
		setTeam(null);
	};

	// favoriteTeamLeagueMap 변경될 때마다 pk 배열을 위로 전달
	useEffect(() => {
		// optional인 setTeams가 undefined이면 return
		if (!setTeams) return;

		// 응원팀까지 선택 완료한 경우만 필터링
		const favoriteTeams = favoriteTeamLeagueMap.filter((favorite) => favorite?.team);

		if (favoriteTeams.length === 0) {
			setTeams(null);
		} else {
			const teams = favoriteTeams.map((favorite) => favorite.team.pk);
			setTeams(teams);
		}
	}, [favoriteTeamLeagueMap, setTeams]);

	useEffect(() => {
		if (initialTeams) {
			const initialFavoriteTeamLeagueMap: TeamLeagueMap[] = initialTeams.map((team) => ({
				league: { nameEn: team.leagueNameEn, nameKr: team.leagueNameKr, pk: team.leaguePk, logoUrl: '' },
				team,
			}));
			setFavoriteTeamLeagueMap(initialFavoriteTeamLeagueMap);
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
					favoriteTeamLeagueMap={favoriteTeamLeagueMap}
					setFavoriteTeamLeagueMap={setFavoriteTeamLeagueMap}
					selectedTeamIndex={selectedTeamIndex}
					setSelectedTeamIndex={setSelectedTeamIndex}
					clearSelectbox={clearSelectbox}
				/>
			</div>

			{isEditable && (
				<div className="space-y-6 mt-[1.125rem]">
					<Selectbox
						category="리그"
						favoriteTeamLength={favoriteTeamLeagueMap.length}
						content={league}
						onChange={handleLeagueChange}
					/>
					{league && league.pk !== NO_CHEERING_TEAM_PK && (
						<Selectbox
							category="응원팀"
							isOpen={isDropdownOpen}
							content={team}
							league={league.pk}
							onChange={handleTeamChange}
						/>
					)}
				</div>
			)}
		</div>
	);
}
