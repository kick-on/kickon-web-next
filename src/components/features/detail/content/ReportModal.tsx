import Image from 'next/image';
import { useState } from 'react';

interface ReportModalProps {
	onClose: () => void;
}

const REPORT_REASONS = [
	'허위사실이에요.',
	'비방 및 욕설 표현을 사용했어요.',
	'선정성 게시글이에요.',
	'스팸 홍보/도배글이에요.',
	'개인정보가 노출되었어요.',
	'저작권 및 법적인 문제예요.',
	'기타',
];

const ReportModal: React.FC<ReportModalProps> = ({ onClose }) => {
	const [selectedReason, setSelectedReason] = useState<string | null>(null);
	const [otherReason, setOtherReason] = useState('');

	const handleReasonChange = (reason: string) => {
		setSelectedReason(reason);
		if (reason !== '기타') {
			setOtherReason('');
		}
	};

	const isSubmitEnabled = selectedReason !== null && (selectedReason !== '기타' || otherReason.trim().length > 0);

	return (
		<div className="fixed inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
			<div className="bg-black-000 px-[35px] py-6 rounded-[10px] w-[378px]">
				<div className="flex gap-24 ml-24">
					<h2 className="title3-semibold text-black-900 mb-10.5">게시글 신고</h2>
					<button onClick={onClose}>
						<Image src="/x.svg" alt="취소 버튼" width={24} height={24} />
					</button>
				</div>
				<div className="flex flex-col gap-4">
					{REPORT_REASONS.map((reason) => (
						<label key={reason} className="flex body5-regular items-center gap-2 text-black-900 cursor-pointer">
							<input
								type="radio"
								name="reportReason"
								value={reason}
								checked={selectedReason === reason}
								onChange={() => handleReasonChange(reason)}
								className="appearance-none w-4.5 h-4.5 border border-black-300 rounded-[2px] checked:bg-black-900 checked:bg-[url('/check-icon.svg')] checked:bg-center checked:bg-no-repeat cursor-pointer"
							/>
							{reason}
						</label>
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
						disabled={!isSubmitEnabled}
						className={`w-77 px-4 py-[10px] rounded-lg ${
							isSubmitEnabled ? 'bg-black-900 text-black-000' : 'bg-black-300 text-black-500 cursor-not-allowed'
						}`}
					>
						신고하기
					</button>
				</div>
			</div>
		</div>
	);
};

export default ReportModal;
