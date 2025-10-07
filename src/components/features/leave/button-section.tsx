'use client';

import BottomButton from '@/components/common/bottom-button';
import { leaveReasons } from '@/lib/constants/leave';
import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import { deleteUserMe } from '@/services/apis/user/user.api';
import { useRouter } from 'next/navigation';

export default function ButtonSection({ selectedReasonIndex, etcContent, isValidCheck }) {
	const router = useRouter();
	const { clearCurrentUserInfo } = useCurrentUserInfoStore();

	const isEtc = selectedReasonIndex === leaveReasons.length - 1;
	const isValidReason = isEtc ? etcContent.trim() !== '' : selectedReasonIndex !== null;
	const isButtonDisabled = !(isValidReason && isValidCheck);

	const handleWithdrawalButtonClick = async () => {
		if (selectedReasonIndex === null) alert('탈퇴 사유를 선택해 주세요.');

		try {
			const body = { reason: isEtc ? etcContent : leaveReasons[selectedReasonIndex] };
			await deleteUserMe(body);

			alert('탈퇴가 완료되었습니다.');
			clearCurrentUserInfo();
			localStorage.clear();
			router.replace('/');
		} catch (error) {
			alert(error.message);
		}
	};

	return (
		<BottomButton
			buttons={[
				{ text: '취소', onClick: () => router.push('/profile-setting') },
				{ text: '회원 탈퇴', onClick: handleWithdrawalButtonClick, disabled: isButtonDisabled },
			]}
		/>
	);
}
