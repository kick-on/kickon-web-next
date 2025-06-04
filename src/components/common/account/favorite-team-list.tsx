'use client';

import { TeamDto } from '@/services/apis/team/dto';
import { useState } from 'react';
import FavoriteTeamItem from './favorite-team-item';
import Image from 'next/image';

export default function FavoriteTeamList() {
	const [teamList, setTeamList] = useState<TeamDto[]>([
		{ pk: 1, nameKr: '', nameEn: '', logoUrl: '' },
		{ pk: 1, nameKr: '', nameEn: '', logoUrl: '' },
	]);

	return (
		<div className="grid grid-cols-3 gap-2.5 items-end">
			{teamList.map((team, i) => (
				<FavoriteTeamItem key={team?.pk} orderNum={i + 1} />
			))}
			<button
				className="w-full h-auto aspect-[5/4] flex flex-col gap-1 justify-center items-center 
          rounded-lg bg-black-000 p-[5px] border border-black-300"
			>
				<div className="relative w-12 h-12 @mobile:w-[2.1875rem] @mobile:h-[2.1875rem]">
					<Image src={'/plus.svg'} alt="팀 추가 버튼" fill className="w-auto h-auto" />
				</div>
			</button>
		</div>
	);
}
