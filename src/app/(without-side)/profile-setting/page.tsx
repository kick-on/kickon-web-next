'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Nickname from '@/components/features/signup/nickname';
import { useEffect, useState } from 'react';
import AccountSelectBox from '@/components/common/account-selectbox';
import { LeagueDto } from '@/services/apis/league/dto';
import { TeamDto } from '@/services/apis/team/dto';
import { UpdateUserInfoRequest } from '@/services/auth/dto';
import { getUserInfo, updateUserInfo } from '@/services/auth';
import { NO_CHEERING_TEAM_PK } from '@/lib/constants';
import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import { getAccessToken } from '@/lib/utils/getAccessToken';

export default function Page() {
	const { currentUserInfo, setCurrentUserInfo } = useCurrentUserInfoStore();

	const [nickname, setNickname] = useState('');
	const [league, setLeague] = useState<LeagueDto>({
		pk: NO_CHEERING_TEAM_PK,
		nameKr: '응원팀이 없어요.',
		nameEn: 'no cheering team',
		logoUrl: '/ban.svg',
	});
	const [team, setTeam] = useState<TeamDto>({
		pk: NO_CHEERING_TEAM_PK,
		nameKr: '응원팀이 없어요.',
		nameEn: 'no cheering team',
		logoUrl: '/ban.svg',
	});

	const route = useRouter();

	const isEditable = false;
	const hasTeam = league.nameKr !== '응원팀이 없어요.';
	const socialLogoUrl = currentUserInfo?.providerType === 'KAKAO' ? '/sns/kakao-small.svg' : '/sns/naver-small.svg';

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
		const body: UpdateUserInfoRequest = {
			nickname,
			team: team.pk === -1 ? undefined : team.pk, // 응원하는 팀이 없는 경우 team을 undefined로
			// league: league.pk, 현재 서버에서 league를 처리하지 않음
		};

		editUserInfo(body);
	};

	const editUserInfo = async (body: UpdateUserInfoRequest) => {
		const response = await updateUserInfo(body);

		if (typeof response === 'string') {
			alert(response);
		} else {
			route.push('/');
		}
	};

	useEffect(() => {
		if (!getAccessToken()) {
			alert('로그인이 필요한 서비스입니다. 홈으로 이동합니다.');
			route.push('/?login=true');
		}
	}, [route]);

	useEffect(() => {
		// 새로고침해도 유저 정보 유지 -> persist로 대체 가능
		const getCurrentUserInfo = async () => {
			const response = await getUserInfo();

			if (typeof response !== 'string') {
				setCurrentUserInfo(response.data);

				setNickname(response.data.nickname);
				setLeague({
					pk: response.data.league.pk,
					nameKr: response.data.league.nameKr,
					nameEn: response.data.league.nameEn,
					logoUrl: response.data.league.logoUrl,
				});
				setTeam({
					pk: response.data.favoriteTeam.pk,
					nameKr: response.data.favoriteTeam.nameKr,
					nameEn: response.data.favoriteTeam.nameEn,
					logoUrl: response.data.favoriteTeam.logoUrl,
				});
			}
		};
		getCurrentUserInfo();
	}, [setCurrentUserInfo]);

	return (
		<div className="m-auto w-[21.5rem] flex flex-col">
			<div className="relative mb-7 w-[68px] h-[68px] rounded-full overflow-hidden">
				<Image
					className="w-full h-full object-cover"
					width={68}
					height={68}
					src={currentUserInfo?.profileImageUrl || '/default-profile.svg'}
					alt="프로필 이미지"
				/>
				{/* <button
				onClick={()=>{}}
					className="absolute z-10 left-11 top-11
            bg-black-000 border border-black-200 rounded-full p-[0.3125rem]"
				>
					<Image width={18} height={18} src="/camera.svg" alt="프로필 사진 변경" />
				</button> */}
			</div>

			<div className="flex flex-col gap-6">
				<Nickname nickname={nickname} onChange={handleNicknameChange} />
				<AccountSelectBox isEditable={isEditable} category={'리그'} content={league} onChange={handleLeagueChange} />
				{hasTeam && (
					<AccountSelectBox isEditable={isEditable} category={'응원팀'} content={team} onChange={handleTeamChange} />
				)}
			</div>

			<div className="flex flex-col gap-2 mt-[4.25rem]">
				<div className="flex gap-1.5 items-center subtitle1-medium">계정 관리</div>
				<div
					className="flex gap-2.5 items-center px-4 py-3 w-full
						border border-black-300 rounded-lg bg-black-100 body3-regular"
				>
					<Image width={18} height={18} src={socialLogoUrl} alt={`${currentUserInfo?.providerType} 로고`} />
					{currentUserInfo?.email}
				</div>
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
