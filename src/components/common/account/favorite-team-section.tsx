'use client';

import { LeagueDto } from '@/services/apis/league/dto';
import Selectbox from './selectbox';
import { useState } from 'react';
import { TeamDto } from '@/services/apis/team/dto';
import FavoriteTeamList from './favorite-team-list';
import { NO_CHEERING_TEAM_PK } from '@/lib/constants';

export default function FavoriteTeamSection() {
	const [favoriteTeams, setFavoriteTeams] = useState<(TeamDto | null)[]>([
		{ pk: 1, logoUrl: '', nameEn: '', nameKr: '' },
		{ pk: 2, logoUrl: '', nameEn: '', nameKr: '' },
		{ pk: 3, logoUrl: '', nameEn: '', nameKr: '' },
	]);

	const [league, setLeague] = useState<LeagueDto | null>(null);
	const [team, setTeam] = useState<TeamDto | null>(null);

	return (
		<div className="flex flex-col">
			<div className="subtitle1-semibold mb-2">
				MY팀 선택 (<span className="text-primary-900">1</span>/3)
			</div>
			<div className="caption1-regular mb-6">* 최대 3순위까지 선택할 수 있으며, 프로필에는 1순위만 표기돼요.</div>

			<div className="mb-[1.125rem]">
				<FavoriteTeamList favoriteTeams={favoriteTeams} setFavoriteTeams={setFavoriteTeams} />
			</div>

			<div className="space-y-6">
				<Selectbox category="리그" content={league} onChange={(selectedLeague) => setLeague(selectedLeague)} />
				{league && league.pk !== NO_CHEERING_TEAM_PK && (
					<Selectbox
						category="응원팀"
						content={team}
						league={league.pk}
						onChange={(selectedTeam) => setTeam(selectedTeam)}
					/>
				)}
			</div>
		</div>
	);
}
