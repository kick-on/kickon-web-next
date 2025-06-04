'use client';

import { LeagueDto } from '@/services/apis/league/dto';
import Selectbox from './selectbox';
import { useEffect, useState } from 'react';
import { TeamDto } from '@/services/apis/team/dto';
import FavoriteTeamList from './favorite-team-list';
import { NO_CHEERING_TEAM_PK } from '@/lib/constants';

export default function FavoriteTeamSection() {
	const [favoriteTeams, setFavoriteTeams] = useState<(TeamDto | null)[]>([null]);
	const [selectedTeamIndex, setSelectedTeamIndex] = useState(0);
	const favoriteTeamCount = favoriteTeams.filter((team) => team).length;

	const [league, setLeague] = useState<LeagueDto | null>(null);
	const [team, setTeam] = useState<TeamDto | null>(null);

	// 다른 순위의 팀을 선택했을 때마다 실행 (ex. 1순위 팀 -> 2순위 팀)
	useEffect(() => {
		const selectedTeam = favoriteTeams[selectedTeamIndex];
		setTeam(selectedTeam);
	}, [selectedTeamIndex]);

	const handleTeamChange = (selectedTeam) => {
		const newFavoriteTeams = favoriteTeams.map((team, i) => (i === selectedTeamIndex ? selectedTeam : team));
		setFavoriteTeams(newFavoriteTeams);
		setTeam(selectedTeam);
	};

	const clearSelectbox = () => {
		// setLeague(null);
		setTeam(null);
	};

	return (
		<div className="flex flex-col">
			<div className="subtitle1-semibold mb-2">
				MY팀 선택 (<span className="text-primary-900">{favoriteTeamCount}</span>/3)
			</div>
			<div className="caption1-regular mb-6">* 최대 3순위까지 선택할 수 있으며, 프로필에는 1순위만 표기돼요.</div>

			<div className="mb-[1.125rem]">
				<FavoriteTeamList
					favoriteTeams={favoriteTeams}
					setFavoriteTeams={setFavoriteTeams}
					selectedTeamIndex={selectedTeamIndex}
					setSelectedTeamIndex={setSelectedTeamIndex}
					clearSelectbox={clearSelectbox}
				/>
			</div>

			<div className="space-y-6">
				<Selectbox category="리그" content={league} onChange={(selectedLeague) => setLeague(selectedLeague)} />
				{league && league.pk !== NO_CHEERING_TEAM_PK && (
					<Selectbox category="응원팀" content={team} league={league.pk} onChange={handleTeamChange} />
				)}
			</div>
		</div>
	);
}
