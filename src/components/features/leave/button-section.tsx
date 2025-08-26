'use client';

import { reasons } from '@/app/(without-side)/withdrawal/page';
import BottomButton from '@/components/common/bottom-button';
import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import { deleteUserMe } from '@/services/apis/user';
import { useRouter } from 'next/navigation';

export default function ButtonSection({ selectedReason, etcContent, isValidCheck }) {
	const router = useRouter();
	const { clearCurrentUserInfo } = useCurrentUserInfoStore();

	const isValidReason = selectedReason === 3 ? etcContent.trim() !== '' : selectedReason !== null;
	const isButtonDisabled = !(isValidReason && isValidCheck);

	const handleWithdrawalButtonClick = async () => {
		if (selectedReason === null) alert('탈퇴 사유를 선택해 주세요.');

		// 기타 선택 시 etc content를 넘김
		const body = {
			reason: reasons[selectedReason] === reasons.at(-1) ? etcContent : reasons[selectedReason],
		};
		const response = await deleteUserMe(body);

		if (typeof response === 'string') {
			alert(`서버 오류입니다.\n잠시 후 다시 시도해 주세요.`);
			console.log(response);
		} else {
			alert('탈퇴가 완료되었습니다.');
			clearCurrentUserInfo();
			localStorage.clear();
			router.replace('/');
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
