'use client';

import { useEffect, useMemo, useState } from 'react';
import { TeamDto } from '@/services/apis/team/dto';
import dynamic from 'next/dynamic';
import FavoriteTeamItem from './favorite-team-item';
import SelectSection from './select-section';
import { NO_CHEERING_TEAM_PK } from '@/lib/constants';
import FavoriteTeamHeader from './favorite-team-header';

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

export default function FavoriteTeamSection({
	type,
	setTeams,
	initialTeams,
}: {
	type: 'signup' | 'profile-setting';
	setTeams: (pks: number[]) => void;
	initialTeams?: TeamDto[];
}) {
	const isSignup = type === 'signup';

	// 응원팀 순서 변경 가능 여부
	// 회원가입 페이지이거나, 프로필 설정에서 편집 클릭
	const [isEditable, setIsEditable] = useState(isSignup);

	const [favoriteTeams, setFavoriteTeams] = useState<(TeamDto | null)[]>([null]);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const filteredTeams = useMemo(
		() => favoriteTeams.filter((team) => team && team.pk !== NO_CHEERING_TEAM_PK),
		[favoriteTeams],
	);

	useEffect(() => {
		if (initialTeams) {
			setFavoriteTeams(initialTeams);
		}
	}, [initialTeams]);

	// 선택이 완료된 팀 배열이 변경될 때마다 pk 배열을 위로 전달
	useEffect(() => {
		const teamPks = filteredTeams.map((team) => team.pk);
		setTeams(teamPks);
	}, [filteredTeams]);

	return (
		<div className="flex flex-col">
			<FavoriteTeamHeader
				isSignup={isSignup}
				teamCount={filteredTeams.length}
				onClickEditButton={() => setIsEditable(true)}
			/>

			<FavoriteTeamList
				isEditable={isEditable}
				favoriteTeams={favoriteTeams}
				setFavoriteTeams={setFavoriteTeams}
				selectedIndex={selectedIndex}
				setSelectedIndex={setSelectedIndex}
			/>

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
