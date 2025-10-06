'use client';

import BottomButton from '@/components/common/bottom-button';
import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import { updateUserInfo } from '@/services/apis/user/user.api';
import { UpdateUserInfoRequest } from '@/services/apis/user/user.type';
import { useRouter } from 'next/navigation';

export default function ButtonSection({ profileImageUrl, nickname, teamPks, isDuplicated, setIsDuplicated }) {
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
		try {
			await updateUserInfo(body);
			await fetchUserInfo(); // 회원 정보 수정 성공 -> current user info 업데이트
			alert('정상적으로 수정되었습니다.');
		} catch (error) {
			if (error.errorData.code === 'DUPLICATED_NICKNAME') {
				setIsDuplicated(true);
			} else {
				alert(error.message);
				setIsDuplicated(false);
			}
		}
	};

	const buttons = [
		{
			text: '취소',
			onClick: handleCancelButtonClick,
		},
		{
			text: '수정 완료',
			onClick: handleCompleteButtonClick,
			disabled: !nickname || isDuplicated || !teamPks || !isSomethingChanged,
		},
	];

	return (
		<div className="mt-[6.25rem]">
			<BottomButton buttons={buttons} />
		</div>
	);
}
