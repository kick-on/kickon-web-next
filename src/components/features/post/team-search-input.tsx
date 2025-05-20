'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';
import Image from 'next/image';
import clsx from 'clsx';
import { getTeam } from '@/services/apis/team';
import useIsMobile from '@/lib/hooks/useIsMobile';

interface Team {
	id: number;
	name: string;
	logo: string;
}

interface TeamSearchInputProps {
	selectedTeam: Team | null;
	setSelectedTeam: (team: Team | null) => void;
}

export default function TeamSearchInput({ selectedTeam, setSelectedTeam }: TeamSearchInputProps) {
	const isMobile = useIsMobile();

	const [searchTerm, setSearchTerm] = useState('');
	const [teams, setTeams] = useState<Team[]>([]);
	const [isVisibleSearchResults, setIsVisibleSearchResults] = useState(false);
	const searchRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (selectedTeam) {
			setSearchTerm(selectedTeam.name);
		}
	}, [selectedTeam]);

	const getTeamLists = useCallback(async (term: string) => {
		if (!term) {
			setTeams([]);
			return;
		}
		try {
			const response = await getTeam(undefined, term);
			const teamData = response.data.map((team) => ({
				id: team.pk,
				name: team.nameKr ?? team.nameEn,
				logo: team.logoUrl,
			}));
			setTeams(teamData);
		} catch (error) {
			console.error('팀 리스트 가져오기 실패:', error);
			setTeams([]);
		}
	}, []);

	const debouncedFetchTeams = useRef(debounce(getTeamLists, 300)).current;

	useEffect(() => {
		debouncedFetchTeams(searchTerm);
		return () => {
			debouncedFetchTeams.cancel();
		};
	}, [searchTerm, debouncedFetchTeams]);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.trim();
		setSearchTerm(value);
		setSelectedTeam(null);
		setIsVisibleSearchResults(value.length > 0);
	};

	const handleSelectTeam = (team: Team) => {
		setSelectedTeam(team);
		setSearchTerm(team.name);
		setIsVisibleSearchResults(false);
	};

	const handleClearSearch = () => {
		setSearchTerm('');
		setSelectedTeam(null);
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
				setIsVisibleSearchResults(false);
			}
		};
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, []);

	return (
		<div ref={searchRef} className="relative w-71 @mobile:w-41.5">
			<div className="relative button4-medium @mobile:text-13 flex items-center border border-black-300 rounded-lg h-9 px-4 py-[0.5625rem]">
				{selectedTeam && (
					<Image
						src={selectedTeam.logo}
						alt={selectedTeam.name}
						width={16}
						height={16}
						className="mr-2 w-4 h-4 object-contain"
					/>
				)}

				<input
					type="text"
					placeholder="팀명"
					value={searchTerm}
					onChange={handleSearchChange}
					className={clsx('w-full focus:outline-none', isMobile && 'max-w-[120px] truncate')}
				/>

				{searchTerm ? (
					<Image
						width={16}
						height={16}
						src="/x.svg"
						alt="초기화"
						onClick={handleClearSearch}
						className="cursor-pointer"
					/>
				) : (
					<Image width={16} height={16} src="/search.svg" alt="검색" />
				)}
			</div>
			{/*max-w 조정 필요*/}
			{isVisibleSearchResults && (
				<div className="z-50 absolute top-10 w-full bg-black-000 border border-black-200 button4-medium @mobile:text-13 rounded-lg shadow-lg overflow-hidden">
					{teams.length > 0 ? (
						teams.map((team, index) => (
							<div
								key={team.id}
								className={clsx(
									'@mobile:max-w-41.5 @mobile:truncate flex items-center gap-2 px-4 py-2.5 cursor-pointer hover:bg-black-200 transition-colors',
									{
										'rounded-b-sm': index === teams.length - 1,
									},
								)}
								onClick={() => handleSelectTeam(team)}
							>
								<Image className="w-4 h-4 object-contain" src={team.logo} alt={team.name} width={16} height={16} />
								{team.name}
							</div>
						))
					) : (
						<div className="px-4 py-2.5 text-black-300">검색 결과 없음</div>
					)}
				</div>
			)}
		</div>
	);
}
