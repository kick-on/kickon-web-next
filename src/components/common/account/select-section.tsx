'use client';

import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import Selectbox from './selectbox-copy';
import { LeagueDto } from '@/services/apis/league/dto';
import { TeamDto } from '@/services/apis/team/dto';
import { getLeague } from '@/services/apis/league';
import { getTeam } from '@/services/apis/team';
import { NO_CHEERING_TEAM_PK } from '@/lib/constants';
import { Option } from '../option-item';

export default function SelectSection({
	selectedIndex,
	favoriteTeams,
	setFavoriteTeams,
}: {
	selectedIndex: number;
	favoriteTeams: TeamDto[];
	setFavoriteTeams: Dispatch<SetStateAction<TeamDto[]>>;
}) {
	const selectedTeam = useMemo(() => favoriteTeams[selectedIndex], [favoriteTeams, selectedIndex]);
	const leagueContent: Option | null = useMemo(
		() =>
			selectedTeam
				? {
						pk: selectedTeam.leaguePk,
						nameKr: selectedTeam.leagueNameKr,
						logoUrl: selectedTeam.leagueLogoUrl,
					}
				: null,
		[selectedTeam],
	);

	const [teamOptions, setTeamOptions] = useState<TeamDto[]>([]);
	const [leagueOptions, setLeagueOptions] = useState<LeagueDto[]>([]);
	const [selectedLeaguePk, setSelectedLeaguePk] = useState<number | null>(selectedTeam?.leaguePk ?? null);

	// selected team 변경될 때 selected league pk 업데이트
	// -> team options 업데이트
	useEffect(() => {
		setSelectedLeaguePk(selectedTeam?.leaguePk ?? null);
	}, [selectedTeam]);

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

	const handleLeagueChange = (pk: number) => {
		if (pk === NO_CHEERING_TEAM_PK) {
			const newFavoriteTeams = favoriteTeams.map((team, i) =>
				i === selectedIndex
					? {
							pk: -1,
							nameKr: '응원팀이 없어요',
							nameEn: 'no cheering team',
							logoUrl: '/ban.svg',
							leaguePk: -1,
							leagueNameKr: '응원팀이 없어요',
							leagueNameEn: 'no cheering team',
							leagueLogoUrl: '/ban.svg',
						}
					: { ...team },
			);
			setFavoriteTeams(newFavoriteTeams);
		} else if (pk !== selectedLeaguePk) {
			setIsTeamDropdownOpen(true);
		}
		setSelectedLeaguePk(pk);
	};

	const handleTeamChange = (team: TeamDto) => {
		setFavoriteTeams((prev) => prev.map((prevTeam, i) => (i === selectedIndex ? { ...team } : { ...prevTeam })));
	};

	// 리그 선택 시 팀 선택 드롭다운 자동 오픈
	const [isTeamDropdownOpen, setIsTeamDropdownOpen] = useState(false);
	const [isLeagueDropdownOpen, setIsLeagueDropdownOpen] = useState(false);

	return (
		<div className="space-y-6 mt-[1.125rem]">
			<Selectbox
				category="리그"
				favoriteTeams={favoriteTeams}
				isDropdownOpen={isLeagueDropdownOpen}
				setIsDropdownOpen={(isOpen: boolean) => setIsLeagueDropdownOpen(isOpen)}
				options={leagueOptions}
				content={leagueContent}
				onChange={handleLeagueChange}
			/>
			{teamOptions.length > 0 && selectedLeaguePk !== -1 && (
				<Selectbox
					category="응원팀"
					favoriteTeams={favoriteTeams}
					isDropdownOpen={isTeamDropdownOpen}
					setIsDropdownOpen={(isOpen: boolean) => setIsTeamDropdownOpen(isOpen)}
					options={teamOptions}
					content={selectedTeam?.pk === -1 ? null : selectedTeam}
					onChange={handleTeamChange}
				/>
			)}
		</div>
	);
}
