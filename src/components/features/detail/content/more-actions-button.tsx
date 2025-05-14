'use client';

import { useState, useRef, useEffect, FC } from 'react';
import clsx from 'clsx';
import Image from 'next/image';
import ReportModal from './report-modal';
import ConfirmModal from './confirm-modal';
import EditIcon from '@/assets/edit.svg';

// TODO: url 공유 되고 나서 모달 띄우기

interface MoreActionsButtonProps {
	type: 'news' | 'board';
	pk: number;
	isMyContent: boolean;
}

const MoreActionsButton: FC<MoreActionsButtonProps> = ({ type, pk, isMyContent }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [showReportModal, setShowReportModal] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // 삭제 모달 상태 추가
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

	const handleDeleteClick = () => {
		setIsOpen(false);
		setShowDeleteConfirm(true); // 삭제 모달 열기
	};

	const handleConfirmDelete = () => {
		console.log('삭제.');
		setShowDeleteConfirm(false);
	};

	return (
		<>
			<div className="relative inline-block">
				<button ref={buttonRef} onClick={() => setIsOpen((prev) => !prev)} className="flex items-center pl-1">
					<Image
						src="/more-horizontal.svg"
						alt="더보기"
						width={20}
						height={20}
						className="@mobile:w-4.5 @mobile:h-4.5"
					/>
				</button>

				{isOpen && (
					<div
						ref={menuRef}
						className={clsx(
							'absolute @mobile:right-0 mt-2 items-center shadow-[0_4px_10px_0_rgba(0,0,0,0.16)]',
							'w-[7.1875rem] bg-black-000 rounded-lg border border-black-300 z-50 flex flex-col px-5 button4-medium text-black-900',
							isMyContent ? 'py-4 gap-[30px]' : 'py-[11px] gap-5',
						)}
					>
						{isMyContent ? (
							<div className="flex flex-col gap-[30px]">
								<button className="flex items-center gap-2 whitespace-nowrap" onClick={handleDeleteClick}>
									<EditIcon alt="수정하기 버튼" width={18} height={18} className="w-[18px] h-[18px] stroke-black-600" />
									수정하기
								</button>
								<button className="flex items-center gap-2 whitespace-nowrap" onClick={handleDeleteClick}>
									<Image src="/trash.svg" alt="삭제하기 버튼" width={18} height={18} />
									삭제하기
								</button>
							</div>
						) : (
							<button className="flex items-center gap-2 whitespace-nowrap" onClick={handleReportButtonClick}>
								<Image src="/report.svg" alt="신고하기 버튼" width={18} height={18} />
								신고하기
							</button>
						)}

						<button className="flex items-center gap-2 whitespace-nowrap" onClick={handleShareButtonClick}>
							<Image src="/share.svg" alt="공유하기 버튼" width={18} height={18} />
							공유하기
						</button>
					</div>
				)}
			</div>

			{showReportModal && <ReportModal type={type} pk={pk} onClose={() => setShowReportModal(false)} />}

			{showDeleteConfirm && (
				<ConfirmModal
					description="게시글을 삭제하시겠습니까?"
					onConfirm={handleConfirmDelete}
					onCancel={() => setShowDeleteConfirm(false)}
				/>
			)}
		</>
	);
};

export default MoreActionsButton;
