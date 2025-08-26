'use client';

import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import { getCookie } from '@/lib/utils';
import { deleteUserMe } from '@/services/apis/user';
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const reasons = ['서비스 품질 및 정보 불만족', '다른 계정으로 재가입', '사용성 불만족', '기타'];
const alerts = [
	`계정을 삭제하면 모든 활동 정보 및 포인트가 삭제되며,\n삭제 후 7일간 동일한 계정으로 다시 가입할 수 없어요.`,
	`추후에 동일한 계정으로 재가입하셔도\n포인트 내역은 복구되지 않아요.`,
	`다른 사용자 게시글의 댓글은 삭제되지 않으니\n미리 확인하세요.`,
];

export default function Page() {
	const { currentUserInfo, clearCurrentUserInfo } = useCurrentUserInfoStore();

	const [selectedReason, setSelectedReason] = useState<number | null>(null);
	const [etcContent, setEtcContent] = useState('');

	const textareaRef = useRef<HTMLTextAreaElement | null>(null);
	const checkboxRef = useRef<HTMLInputElement | null>(null);

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

	// 기타 사유 textarea 높이 자동 조절
	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto';
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		}
	}, [etcContent]);

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
			<span className="mb-10 @mobile:mb-8">
				<span className="font-semibold">{currentUserInfo?.nickname || '알수없음'}</span>님이 탈퇴하시려는 이유가
				궁금해요.
			</span>

			<div className="w-full flex flex-col gap-4">
				{reasons.map((reason, i) => (
					<label
						key={reason}
						id="reason"
						className={clsx(
							'w-full py-[0.9375rem] px-4 flex flex-col gap-3 justify-center bg-black-000 border rounded-lg cursor-pointer',
							selectedReason === i ? 'border-primary-900' : 'border-black-300',
						)}
					>
						<div className="flex gap-4 items-center">
							<input
								name="reason"
								type="radio"
								onChange={() => setSelectedReason(i)}
								className="relative appearance-none w-[1.125rem] h-[1.125rem] rounded-full border border-black-300
                  before:content-[''] before:absolute before:left-1/2 before:top-1/2
                  before:-translate-x-1/2 before:-translate-y-1/2
                  before:w-2.5 before:h-2.5 before:bg-primary-900
                  before:rounded-full before:hidden checked:before:block"
							/>
							{reason}
						</div>
						{selectedReason === 3 && i === 3 && (
							<textarea
								ref={textareaRef}
								value={etcContent}
								rows={3}
								maxLength={500}
								placeholder="고객님의 소중한 피드백을 받아 더 나은 서비스로 보답할게요."
								onChange={(e) => setEtcContent(e.target.value)}
								className="w-full p-4 border border-black-300 rounded-md outline-none resize-none no-scrollbar
									placeholder:text-caption-01 placeholder:text-black-600 placeholder:break-keep text-body-06"
							/>
						)}
					</label>
				))}
			</div>

			<hr className="w-full border-black-300 my-15" />

			<div className="w-full p-4 flex flex-col gap-2.5 bg-black-800 rounded-lg">
				{alerts.map((alert) => (
					<div
						key={alert}
						className="flex gap-1.5 items-center text-black-000 body7-regular @mobile:font-12
              @max-[374px]:whitespace-normal @max-[374px]:break-words whitespace-break-spaces break-keep"
					>
						<Image src={'/alert-circle.svg'} alt="주의 아이콘" width={18} height={18} />
						{alert}
					</div>
				))}
			</div>

			<label className="flex items-center gap-2 body5-medium mt-[1.875rem] mb-20">
				<input
					onChange={() => setIsValidCheck(!isValidCheck)}
					ref={checkboxRef}
					type="checkbox"
					className="relative w-[0.875rem] h-[0.875rem] border border-black-300 rounded-xs appearance-none cursor-pointer
            checked:bg-primary-900 checked:border-primary-900
            before:content-[''] before:absolute before:w-full before:h-full
            before:bg-[url('/check.svg')] before:bg-center before:bg-no-repeat
            before:hidden checked:before:block"
				/>
				<span className="cursor-pointer body6-regular">안내사항을 모두 확인하였으며, 이에 동의합니다.</span>
			</label>

			<div className="w-full flex gap-[0.9375rem]">
				<button
					onClick={() => router.push('/profile-setting')}
					className="flex-1 py-2.5 rounded-lg bg-black-200 text-black-700
						text-button-02 font-semibold @mobile:text-button-03 @mobile:font-semibold"
				>
					취소
				</button>
				<button
					onClick={handleWithdrawalButtonClick}
					disabled={isButtonDisabled}
					className="flex-1 py-2.5 rounded-lg text-black-000
						text-button-02 font-semibold @mobile:text-button-03 @mobile:font-semibold
            enabled:bg-primary-900 disabled:bg-black-300"
				>
					회원 탈퇴
				</button>
			</div>
		</div>
	);
}
