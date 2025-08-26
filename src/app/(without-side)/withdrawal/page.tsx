'use client';

import BottomButton from '@/components/common/bottom-button';
import AlertSection from '@/components/features/leave/alert-section';
import CheckboxSection from '@/components/features/leave/checkbox-section';
import ReasonSection from '@/components/features/leave/reason-section';
import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import { getCookie } from '@/lib/utils';
import { deleteUserMe } from '@/services/apis/user';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const reasons = ['서비스 품질 및 정보 불만족', '다른 계정으로 재가입', '사용성 불만족', '기타'];
export const alerts = [
	`계정을 삭제하면 모든 활동 정보 및 포인트가 삭제되며,\n삭제 후 7일간 동일한 계정으로 다시 가입할 수 없어요.`,
	`추후에 동일한 계정으로 재가입하셔도\n포인트 내역은 복구되지 않아요.`,
	`다른 사용자 게시글의 댓글은 삭제되지 않으니\n미리 확인하세요.`,
];

export default function Page() {
	const { clearCurrentUserInfo } = useCurrentUserInfoStore();

	const [selectedReason, setSelectedReason] = useState<number | null>(null);
	const [etcContent, setEtcContent] = useState('');

	const [isValidCheck, setIsValidCheck] = useState(false);
	const isValidReason = selectedReason === 3 ? etcContent.trim() !== '' : selectedReason !== null;
	const isButtonDisabled = !(isValidReason && isValidCheck);

	const router = useRouter();

	const handleWithdrawalButtonClick = async () => {
		if (selectedReason === null) alert('탈퇴 사유를 선택해 주세요.');

		const body = {
			reason: selectedReason === 3 ? etcContent : reasons[selectedReason],
		};
		const response = await deleteUserMe(body);

		if (typeof response === 'string') {
			alert(`서버 오류입니다.\n잠시 후 다시 시도해 주세요.`);
			console.log(response);
		} else {
			clearCurrentUserInfo();
			localStorage.clear();
			router.replace('/');
		}
	};

	// 프로필 세팅을 통한 접근이 아닌 경우 접근 제한
	useEffect(() => {
		const fromProfile = getCookie('fromProfile');

		if (fromProfile !== 'true') {
			alert('잘못된 접근입니다.');
			router.replace('/');
		}
	}, [router]);

	return (
		<div className="w-[21.5rem] m-auto flex flex-col items-center text-body-03 @mobile:text-body-05">
			<div className="mb-[3.125rem] @mobile:mb-[2.375rem] text-title-01 font-bold @mobile:text-title-02">회원 탈퇴</div>

			<ReasonSection
				selectedReason={selectedReason}
				setSelectedReason={setSelectedReason}
				etcContent={etcContent}
				setEtcContent={setEtcContent}
			/>

			<hr className="w-full border-black-300 my-15" />

			<AlertSection />
			<CheckboxSection setIsValidCheck={setIsValidCheck} />

			<BottomButton
				buttons={[
					{ text: '취소', onClick: () => router.push('/profile-setting') },
					{ text: '회원 탈퇴', onClick: handleWithdrawalButtonClick, disabled: isButtonDisabled },
				]}
			/>
		</div>
	);
}
