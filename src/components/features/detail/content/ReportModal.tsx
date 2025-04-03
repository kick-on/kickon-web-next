'use client';
import { reportOptions } from '@/lib/constants/options';
import { postReportDetail } from '@/services/apis/detail/report';
import { PostReportDetailRequest } from '@/services/apis/detail/report/dto';
import Image from 'next/image';
import { useState } from 'react';

interface ReportModalProps {
	onClose: () => void;
	type: string;
	pk: number;
}
export default function ReportModal({ onClose, type, pk }: ReportModalProps) {
	const [selectedReason, setSelectedReason] = useState<string | null>(null);
	const [otherReason, setOtherReason] = useState('');

	const handleOptionChange = (reason: string) => {
		setSelectedReason(selectedReason === reason ? null : reason);

		if (reason !== '기타') setOtherReason('');
	};

	const isSubmitEnabled = selectedReason !== null && (selectedReason !== '기타' || otherReason.trim().length > 0);

	const handleSubmitButtonClick = async () => {
		const isNews = type === 'news';

		const reportData: PostReportDetailRequest = {
			reason: selectedReason === '기타' ? otherReason.trim() : selectedReason!,
			...(type === 'news' ? { news: pk } : { board: pk }),
		};
		console.log(reportData); // 디버깅

		const result = await postReportDetail(reportData, isNews);

		if (result) {
			alert('신고가 접수되었습니다.');
			console.log(result);
			onClose();
		} else {
			alert('신고 접수에 실패했습니다. 다시 시도해주세요.');
			console.log(result);
		}
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
			<div className="bg-black-000 px-[2.1875rem] py-6 rounded-[0.625rem] w-[23.625rem]">
				<div className="flex justify-between items-center mb-10.5">
					<h2 className="title3-semibold text-black-900 text-center flex-grow">게시글 신고</h2>
					<button onClick={onClose} className="ml-auto">
						<Image src="/x.svg" alt="닫기 버튼" width={24} height={24} />
					</button>
				</div>
				<div className="flex flex-col gap-4">
					{reportOptions.map((reason) => (
						<div
							key={reason}
							className="flex items-center gap-2 text-black-900 cursor-pointer"
							onClick={() => handleOptionChange(reason)}
						>
							<div
								className={`w-5 h-5 border border-black-300 rounded flex items-center justify-center 
									${selectedReason === reason ? 'bg-black-900 border-black-900' : 'bg-black-000'}`}
							>
								{selectedReason === reason && <Image src="/check.svg" alt="선택됨" width={12} height={12} />}
							</div>
							{reason}
						</div>
					))}

					{selectedReason === '기타' && (
						<textarea
							maxLength={500}
							value={otherReason}
							onChange={(e) => setOtherReason(e.target.value)}
							placeholder="기타 사유를 입력하세요."
							className="w-77 h-48 body6-regular text-black-900 border border-black-300 rounded mt-2 p-4 resize-none outline-none"
						/>
					)}
				</div>

				<div className="flex justify-end gap-2 mt-4">
					<button
						onClick={handleSubmitButtonClick}
						disabled={!isSubmitEnabled}
						className={`w-77 px-4 py-[0.625rem] rounded-lg ${
							isSubmitEnabled ? 'bg-black-900 text-black-000' : 'bg-black-300 text-black-500 cursor-not-allowed'
						}`}
					>
						신고하기
					</button>
				</div>
			</div>
		</div>
	);
}
