'use client';

import Nickname from '@/components/common/account/nickname';
import { useEffect, useState } from 'react';
import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import FavoriteTeamSection from '@/components/common/account/favorite-team-section';
import ProfileImageSection from '@/components/common/account/profile-image-section';
import AccountManagementSection from '@/components/features/profile-setting/account-management-section';
import ButtonSection from '@/components/features/profile-setting/button-section';

export default function Page() {
	const { currentUserInfo } = useCurrentUserInfoStore();

	const [profileImageUrl, setProfileImageUrl] = useState('');
	const [nickname, setNickname] = useState<string | null>(null);
	const [isDuplicated, setIsDuplicated] = useState(false);
	const [teamPks, setTeamPks] = useState<number[] | null>(null);

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

	const bottomButtonProps = {
		profileImageUrl,
		nickname,
		teamPks,
		isDuplicated,
		setIsDuplicated,
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

			<AccountManagementSection />
			<ButtonSection {...bottomButtonProps} />
		</div>
	);
}
