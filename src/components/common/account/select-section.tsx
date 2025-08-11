'use client';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Selectbox from './selectbox-copy';
import { LeagueDto } from '@/services/apis/league/dto';
import { TeamDto } from '@/services/apis/team/dto';
import { getLeague } from '@/services/apis/league';
import { getTeam } from '@/services/apis/team';
import { NO_CHEERING_TEAM_PK } from '@/lib/constants';

export default function SelectSection({
	selectedIndex,
	favoriteTeams,
	setFavoriteTeams,
}: {
	selectedIndex: number;
	favoriteTeams: TeamDto[];
	setFavoriteTeams: Dispatch<SetStateAction<TeamDto[]>>;
}) {
	const [leagueOptions, setLeagueOptions] = useState<LeagueDto[]>([]);
	const [selectedLeaguePk, setSelectedLeaguePk] = useState<number>();
	const [teamOptions, setTeamOptions] = useState<TeamDto[]>([]);

	useEffect(() => {
		const getLeagueOptions = async () => {
			const response = await getLeague();

			if (!response) return;
			setLeagueOptions(response.data);
		};

		getLeagueOptions();
	}, []);

	useEffect(() => {
		if (!selectedLeaguePk || selectedLeaguePk === -1) return;

		const getTeamOptions = async () => {
			const response = await getTeam(selectedLeaguePk);

			if (!response) return;
			setTeamOptions(response.data);
		};

		getTeamOptions();
	}, [selectedLeaguePk]);

	// 리그 선택 시 팀 선택 드롭다운 자동 오픈
	const [isTeamDropdownOpen, setIsTeamDropdownOpen] = useState(false);
	useEffect(() => {
		setIsTeamDropdownOpen(true);
	}, [selectedLeaguePk]);

	const handleLeagueChange = (pk: number) => {
		if (pk === NO_CHEERING_TEAM_PK) {
			const newFavoriteTeams = favoriteTeams.map((team, i) =>
				i === selectedIndex
					? { pk: -1, nameKr: '응원팀이 없어요', nameEn: 'no cheering team', logoUrl: '/ban.svg' }
					: { ...team },
			);
			setFavoriteTeams(newFavoriteTeams);
		}
		setSelectedLeaguePk(pk);
	};

	return (
		<div className="space-y-6 mt-[1.125rem]">
			<Selectbox
				category="리그"
				favoriteTeamLength={favoriteTeams.length}
				options={leagueOptions}
				onChange={handleLeagueChange}
			/>
			{teamOptions && selectedLeaguePk !== -1 && (
				<Selectbox
					category="응원팀"
					isOpen={isTeamDropdownOpen}
					options={teamOptions}
					onChange={(team: TeamDto) =>
						setFavoriteTeams((prev) => prev.map((prevTeam, i) => (i === selectedIndex ? { ...team } : { ...prevTeam })))
					}
				/>
			)}
		</div>
	);
}
