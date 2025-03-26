'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Nickname from '@/components/features/signup/nickname';
import { useState } from 'react';
import AccountSelectBox from '@/components/common/account-selectbox';
import { leagues } from '@/lib/constants/leagues';

export default function Page() {
	const [nickname, setNickname] = useState('가나다라');
	const [league, setLeague] = useState('응원팀이 없어요.');
	const [team, setTeam] = useState('프리미어 리그');

	const route = useRouter();

	const isEditable = false;
	const hasTeam = league !== '응원팀이 없어요.';

	const handleNicknameChange = (e) => {
		setNickname(e.target.value);
	};

	const handleLeagueChange = (selectedLeague) => {
		if (selectedLeague === league) return;
		setLeague(selectedLeague);
	};

	const handleTeamChange = (selectedTeam) => {
		if (selectedTeam === team) return;
		setTeam(selectedTeam);
	};

	const handleCancelButtonClick = () => {
		route.push('/');
	};

	const handleCompleteButtonClick = () => {
		// api 호출 후
		route.push('/');
	};

	return (
		<div className="m-auto w-[21.5rem] flex flex-col">
			<div className="relative mb-7">
				<Image width={68} height={68} src="/default-profile.svg" alt="프로필 이미지" />
				<button
					className="absolute z-10 left-11 top-11
            bg-black-000 border border-black-200 rounded-full p-[0.3125rem]"
				>
					<Image width={18} height={18} src="/camera.svg" alt="프로필 사진 변경" />
				</button>
			</div>

			<div className="flex flex-col gap-6">
				<Nickname nickname={nickname} onChange={handleNicknameChange} />
				<AccountSelectBox
					isEditable={isEditable}
					category={'리그'}
					options={leagues}
					content={league}
					onChange={handleLeagueChange}
				/>
				{hasTeam && (
					<AccountSelectBox
						isEditable={isEditable}
						category={'응원팀'}
						options={leagues}
						content={team}
						onChange={handleTeamChange}
					/>
				)}
			</div>

			<div className="flex flex-col gap-2 mt-[4.25rem]">
				<div className="flex gap-1.5 items-center subtitle1-medium">계정 관리</div>
				<button
					className="flex gap-2.5 items-center px-4 py-3 w-full
						border border-black-300 rounded-lg bg-black-100 body3-regular"
				>
					<Image width={18} height={18} src="/sns/naver-small.svg" alt="네이버 로고" />
					email.naver.com
				</button>
			</div>

			<div className="mt-[6.25rem] flex gap-4">
				<button
					onClick={handleCancelButtonClick}
					className="w-full h-11 flex justify-center items-center
            rounded-lg bg-black-200 button2-semibold text-black-700"
				>
					취소
				</button>
				<button
					onClick={handleCompleteButtonClick}
					className="w-full h-11 flex justify-center items-center
            rounded-lg bg-primary-900 button2-semibold text-black-000"
				>
					수정 완료
				</button>
			</div>
		</div>
	);
}
