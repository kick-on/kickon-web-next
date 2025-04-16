'use client';

import { useState, useRef, useEffect, FC } from 'react';
import clsx from 'clsx';
import Image from 'next/image';
import ReportModal from './report-modal';

interface MoreActionsButtonProps {
	type: 'news' | 'board';
	pk: number;
}

const MoreActionsButton: FC<MoreActionsButtonProps> = ({ type, pk }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [showReportModal, setShowReportModal] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				menuRef.current &&
				!menuRef.current.contains(e.target as Node) &&
				!buttonRef.current?.contains(e.target as Node)
			) {
				setIsOpen(false);
			}
		};
		document.addEventListener('click', handleClickOutside);
		return () => document.removeEventListener('click', handleClickOutside);
	}, []);

	const handleShareButtonClick = async () => {
		try {
			await navigator.clipboard.writeText(window.location.href);
			alert('URL이 복사되었습니다!');
		} catch (err) {
			console.log(err);
			alert('URL 복사에 실패했습니다.');
		}
		setIsOpen(false);
	};

	const handleReportButtonClick = () => {
		setIsOpen(false);
		setShowReportModal(true);
	};

	return (
		<>
			<div className="relative inline-block">
				<button ref={buttonRef} onClick={() => setIsOpen((prev) => !prev)} className="flex items-center pl-1">
					<Image src="/more-horizontal.svg" alt="더보기" width={20} height={20} />
				</button>

				{isOpen && (
					<div
						ref={menuRef}
						className={clsx(
							'absolute left-0 mt-2 items-center',
							'w-[7.1875rem] bg-black-000 rounded-lg border border-black-300 z-50',
							'flex flex-col px-5 py-[0.625rem] gap-5 button4-medium text-black-900',
						)}
					>
						<button className="flex items-center gap-2 whitespace-nowrap" onClick={handleShareButtonClick}>
							<Image src="/share.svg" alt="공유하기 버튼" width={18} height={18} /> 공유하기
						</button>
						<button className="flex items-center gap-2 whitespace-nowrap" onClick={handleReportButtonClick}>
							<Image src="/report.svg" alt="신고하기기 버튼" width={18} height={18} /> 신고하기
						</button>
					</div>
				)}
			</div>

			{showReportModal && <ReportModal type={type} pk={pk} onClose={() => setShowReportModal(false)} />}
		</>
	);
};

export default MoreActionsButton;
