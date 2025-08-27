'use client';

import { leaveReasons } from '@/lib/constants/leave';
import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import clsx from 'clsx';
import { useEffect, useRef } from 'react';

export default function ReasonSection({ selectedReasonIndex, setSelectedReasonIndex, etcContent, setEtcContent }) {
	const { currentUserInfo } = useCurrentUserInfoStore();
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	// 기타 사유 textarea 높이 자동 조절
	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto';
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		}
	}, [etcContent]);

	return (
		<>
			<span className="mb-10 @mobile:mb-8">
				<span className="font-semibold">{currentUserInfo?.nickname || '알수없음'}</span>님이 탈퇴하시려는 이유가
				궁금해요.
			</span>

			<div className="w-full flex flex-col gap-4">
				{leaveReasons.map((reason, i) => (
					<label
						key={reason}
						id="reason"
						className={clsx(
							'w-full py-[0.9375rem] px-4 flex flex-col gap-3 justify-center bg-black-000 border rounded-lg cursor-pointer',
							selectedReasonIndex === i ? 'border-primary-900' : 'border-black-300',
						)}
					>
						<div className="flex gap-4 items-center">
							<input
								name="reason"
								type="radio"
								onChange={() => setSelectedReasonIndex(i)}
								className="relative appearance-none w-[1.125rem] h-[1.125rem] rounded-full border border-black-300
									before:content-[''] before:absolute before:left-1/2 before:top-1/2
									before:-translate-x-1/2 before:-translate-y-1/2
									before:w-2.5 before:h-2.5 before:bg-primary-900
									before:rounded-full before:hidden checked:before:block"
							/>
							{reason}
						</div>

						{selectedReasonIndex === 3 && i === 3 && (
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
		</>
	);
}
