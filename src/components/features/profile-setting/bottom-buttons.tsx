'use client';

import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import { updateUserInfo } from '@/services/apis/user';
import { UpdateUserInfoRequest } from '@/services/apis/user/dto';
import { useRouter } from 'next/navigation';

export default function BottomButtons({ profileImageUrl, nickname, teamPks, isDuplicated, setIsDuplicated }) {
	const router = useRouter();
	const { currentUserInfo, fetchUserInfo } = useCurrentUserInfoStore();

	const isProfileImageChanged = profileImageUrl !== currentUserInfo?.profileImageUrl;
	const isNicknameChanged = nickname !== currentUserInfo?.nickname;
	const isFavoriteTeamsChanged =
		JSON.stringify(teamPks) !== JSON.stringify(currentUserInfo?.favoriteTeams.map((team) => team?.pk));
	const isSomethingChanged = isProfileImageChanged || isNicknameChanged || isFavoriteTeamsChanged;

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
		<div className="mt-[6.25rem] flex gap-4">
			<button
				onClick={handleCancelButtonClick}
				className="w-full h-11 flex justify-center items-center
          rounded-lg bg-black-200 text-button-02 font-semibold text-black-700
          @mobile:text-button-03 @mobile:font-semibold"
			>
				취소
			</button>
			<button
				disabled={!nickname || isDuplicated || !teamPks || !isSomethingChanged}
				onClick={handleCompleteButtonClick}
				className="w-full h-11 flex justify-center items-center
          rounded-lg text-button-02 font-semibold @mobile:text-button-03 @mobile:font-semibold
          text-black-000 enabled:bg-primary-900 disabled:bg-black-600"
			>
				수정 완료
			</button>
		</div>
	);
}
