'use client';

import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import Image from 'next/image';
import ReportModal from './ReportModal';

const MoreActionsButton = () => {
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
					<Image src="/x.svg" alt="더보기" width={20} height={20} />
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
						<button className="text-left" onClick={handleShareButtonClick}>
							공유하기
						</button>
						<button className="text-left" onClick={handleReportButtonClick}>
							신고하기
						</button>
					</div>
				)}
			</div>

			{showReportModal && <ReportModal onClose={() => setShowReportModal(false)} />}
		</>
	);
};

export default MoreActionsButton;
