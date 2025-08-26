'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Nickname from '@/components/common/account/nickname';
import { useEffect, useState } from 'react';
import { UpdateUserInfoRequest } from '@/services/apis/user/dto';
import { updateUserInfo } from '@/services/apis/user';
import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import { setCookie } from '@/lib/utils';
import FavoriteTeamSection from '@/components/common/account/favorite-team-section';
import ProfileImageSection from '@/components/common/account/profile-image-section';

export default function Page() {
	const router = useRouter();

	const { currentUserInfo, fetchUserInfo } = useCurrentUserInfoStore();
	const socialLogoUrl = currentUserInfo?.providerType === 'KAKAO' ? '/sns/kakao-small.svg' : '/sns/naver-small.svg';

	const [profileImageUrl, setProfileImageUrl] = useState('');
	const [nickname, setNickname] = useState<string | null>(null);
	const [isDuplicated, setIsDuplicated] = useState(false);
	const [teamPks, setTeamPks] = useState<number[] | null>(null);

	const isProfileImageChanged = profileImageUrl !== currentUserInfo?.profileImageUrl;
	const isNicknameChanged = nickname !== currentUserInfo?.nickname;
	const isFavoriteTeamsChanged =
		JSON.stringify(teamPks) !== JSON.stringify(currentUserInfo?.favoriteTeams.map((team) => team?.pk));
	const isSomethingChanged = isProfileImageChanged || isNicknameChanged || isFavoriteTeamsChanged;

	useEffect(() => {
		if (currentUserInfo) {
			// 초기 렌더링 시 state 초기화
			setProfileImageUrl(currentUserInfo.profileImageUrl);
			setNickname(currentUserInfo.nickname);
		}
	}, [currentUserInfo]);

	const handleNicknameChange = (e) => {
		setNickname(e.target.value);
		if (isDuplicated) {
			setIsDuplicated(false);
		}
	};

	const handleCancelButtonClick = () => {
		const previousPage = sessionStorage.getItem('previousPage');
		router.push(previousPage);
	};

	const handleCompleteButtonClick = () => {
		const body: UpdateUserInfoRequest = {
			profileImageUrl: isProfileImageChanged ? profileImageUrl : undefined,
			nickname: isNicknameChanged ? nickname : undefined,
			teams: isFavoriteTeamsChanged ? teamPks : undefined,
		};

		editUserInfo(body);
	};

	const editUserInfo = async (body: UpdateUserInfoRequest) => {
		const response = await updateUserInfo(body);

		if (response === 'DUPLICATED_NICKNAME') {
			setIsDuplicated(true);
		} else if (typeof response === 'string') {
			alert(response);
			setIsDuplicated(false);
		} else {
			// 회원 정보 수정 성공
			// -> 새로 유저 정보 fetch해서 current user info 업데이트
			await fetchUserInfo();
			alert('정상적으로 수정되었습니다.');
		}
	};

	return (
		<div className="m-auto w-[21.5rem] flex flex-col">
			<ProfileImageSection profileImageUrl={profileImageUrl} setProfileImageUrl={setProfileImageUrl} />

			<div className="w-full flex flex-col gap-10">
				<Nickname nickname={nickname} isDuplicated={isDuplicated} onChange={handleNicknameChange} />
				<FavoriteTeamSection
					type="profile-setting"
					initialTeams={currentUserInfo?.favoriteTeams}
					setTeams={setTeamPks}
				/>
			</div>

			<hr className="w-full my-10 h-[1px] border-black-200 @mobile:border-black-300" />

			<div className="relative flex flex-col gap-2">
				<div className="flex gap-1.5 items-center subtitle1-semibold">계정 관리</div>
				<div
					className="flex gap-2.5 items-center px-4 py-3 w-full @mobile:text-14
						border border-black-300 rounded-lg bg-black-100 body3-regular"
				>
					<Image width={18} height={18} src={socialLogoUrl} alt={`${currentUserInfo?.providerType} 로고`} />
					{currentUserInfo?.email}
				</div>

				<button
					onClick={() => {
						router.push('/withdrawal');
						setCookie('fromProfile', 'true', 60);
					}}
					className="absolute -bottom-8 right-0 text-black-500 button5-regular underline"
				>
					회원 탈퇴
				</button>
			</div>

			<div className="mt-[6.25rem] flex gap-4">
				<button
					onClick={handleCancelButtonClick}
					className="w-full h-11 flex justify-center items-center @mobile:text-15
            rounded-lg bg-black-200 button2-semibold text-black-700"
				>
					취소
				</button>
				<button
					disabled={!nickname || isDuplicated || !teamPks || !isSomethingChanged}
					onClick={handleCompleteButtonClick}
					className="w-full h-11 flex justify-center items-center @mobile:text-15
            rounded-lg button2-semibold text-black-000 enabled:bg-primary-900 disabled:bg-black-600"
				>
					수정 완료
				</button>
			</div>
		</div>
	);
}
