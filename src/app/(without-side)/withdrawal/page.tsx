'use client';

import AlertSection from '@/components/features/leave/alert-section';
import ButtonSection from '@/components/features/leave/button-section';
import CheckboxSection from '@/components/features/leave/checkbox-section';
import ReasonSection from '@/components/features/leave/reason-section';
import { getCookie } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page() {
	const [selectedReasonIndex, setSelectedReasonIndex] = useState<number | null>(null);
	const [etcContent, setEtcContent] = useState('');
	const [isValidCheck, setIsValidCheck] = useState(false);

	const router = useRouter();

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
				selectedReasonIndex={selectedReasonIndex}
				setSelectedReasonIndex={setSelectedReasonIndex}
				etcContent={etcContent}
				setEtcContent={setEtcContent}
			/>

			<hr className="w-full border-black-300 my-15" />

			<AlertSection />
			<CheckboxSection setIsValidCheck={setIsValidCheck} />
			<ButtonSection selectedReasonIndex={selectedReasonIndex} etcContent={etcContent} isValidCheck={isValidCheck} />
		</div>
	);
}
