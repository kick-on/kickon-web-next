'use client';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { TeamDto } from '@/services/apis/team/dto';
import dynamic from 'next/dynamic';
import FavoriteTeamItem from './favorite-team-item';
import clsx from 'clsx';
import SelectSection from './select-section';
import { NO_CHEERING_TEAM_PK } from '@/lib/constants';

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
	setTeams: Dispatch<SetStateAction<number[]>>;
	initialTeams?: TeamDto[];
}) {
	const isSignup = type === 'signup';

	// 응원팀 순서 변경 가능 여부
	// 회원가입 페이지이거나, 프로필 설정에서 편집 클릭
	const [isEditable, setIsEditable] = useState(isSignup);

	const [favoriteTeams, setFavoriteTeams] = useState<(TeamDto | null)[]>([null]);
	const [selectedIndex, setSelectedIndex] = useState(0);

	// 응원팀이 완전히 선택된 경우만 필터링
	const filteredTeams = favoriteTeams.filter((team) => team && team.pk !== NO_CHEERING_TEAM_PK);

	// favoriteTeams 변경될 때마다 pk 배열을 위로 전달
	useEffect(() => {
		const teamPks = filteredTeams.map((team) => team.pk);
		setTeams(teamPks);
	}, [filteredTeams]);

	useEffect(() => {
		if (initialTeams) {
			setFavoriteTeams(initialTeams);
		}
	}, [initialTeams]);

	return (
		<div className="flex flex-col">
			<div className="subtitle1-semibold mb-2 flex items-center justify-between">
				<div>
					MY팀 {isSignup && '선택'} (
					<span className={clsx({ 'text-primary-900': isSignup })}>{filteredTeams.length}</span>
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
