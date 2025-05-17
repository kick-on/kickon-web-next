'use client';

import { useState, useRef, useEffect, FC } from 'react';
import clsx from 'clsx';
import Image from 'next/image';
import ReportModal from './report-modal';
import EditIcon from '@/assets/edit.svg';
import AlertModal from './alert-modal';
import { useRouter } from 'next/navigation';

interface MoreActionsButtonProps {
	type?: 'news' | 'board';
	mode?: 'detail' | 'comment';
	pk?: number;
	isMyContent?: boolean;
	commentId?: number;
}

// 뉴스를 삭제하는지, 커뮤니티를 삭제하는지 -> api 호출에 쓰고 라우팅에 쓰기

const MoreActionsButton: FC<MoreActionsButtonProps> = ({ type = 'news', pk, isMyContent = 'true' }) => {
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);
	const [showReportModal, setShowReportModal] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [showShareAlert, setShowShareAlert] = useState(false);
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
			setShowShareAlert(true); // 성공 시 모달 표시
		} catch (err) {
			console.error(err);
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
		setShowDeleteConfirm(true);
	};

	const handleConfirmDelete = () => {
		console.log('삭제.'); // api 호출
		setShowDeleteConfirm(false); // 모달 닫고
		router.push(`/${type}?q=전체`);
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
							'absolute z-50 mt-2 flex flex-col items-center rounded-lg border border-black-300 bg-black-000 text-black-900 shadow-[0_4px_10px_0_rgba(0,0,0,0.16)]',
							'w-[7.1875rem] px-5 py-[11px] button4-medium',
							'@mobile:right-0 @mobile:pr-6 @mobile:py-4',
							!isMyContent && 'gap-5',
						)}
					>
						{isMyContent ? (
							<div className="flex flex-col gap-5 @mobile:gap-[30px]">
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
						{isMyContent && (
							<p className="w-[99px] h-[1px] border border-black-200 -mr-1 my-[12px] @mobile:my-[16px]" />
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
				<AlertModal
					description="게시글을 삭제할까요?"
					onConfirm={handleConfirmDelete}
					onCancel={() => setShowDeleteConfirm(false)}
				/>
			)}
			{showShareAlert && (
				<AlertModal type="info" description="URL이 복사되었습니다." onCancel={() => setShowShareAlert(false)} />
			)}
		</>
	);
};

export default MoreActionsButton;
