'use client';

import { useState, useRef, useEffect, FC } from 'react';
import clsx from 'clsx';
import Image from 'next/image';
import ReportModal from './report-modal';
import EditIcon from '@/assets/edit.svg';
import AlertModal from '../alert-modal';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface MoreActionsButtonProps {
	type?: 'news' | 'board';
	pk?: number;
	isMyContent?: boolean;
	commentId?: number;
}

const MoreActionsButton: FC<MoreActionsButtonProps> = ({ type = 'news', pk, isMyContent = 'true' }) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const fullUrl = `${pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
	const [isOpen, setIsOpen] = useState(false);
	const [isReportModalOpen, setIsReportModalOpen] = useState(false);
	const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
	const [isShareAlertVisible, setIsShareAlertVisible] = useState(false);
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
			setIsShareAlertVisible(true); // 성공 시 모달 표시
		} catch (err) {
			console.error(err);
			alert('URL 복사에 실패했습니다.');
		}
		setIsOpen(false);
	};

	const handleReportButtonClick = () => {
		setIsOpen(false);
		setIsReportModalOpen(true);
	};

	const handleEditClick = () => {
		setIsOpen(false);
		sessionStorage.setItem('previousPage', fullUrl);
		router.push(`/post/${type}?edit=true`);
	}; // boolean 값을 넘기는 것으로 수정

	const handleDeleteClick = () => {
		setIsOpen(false);
		setIsDeleteConfirmOpen(true);
	};

	const handleConfirmDelete = () => {
		console.log('삭제.'); // api 호출
		setIsDeleteConfirmOpen(false); // 모달 닫고
		router.replace(`/${type}?q=전체`);
	};

	const buttonCommonClass =
		'flex w-full justify-center py-[15px] gap-2 whitespace-nowrap hover:bg-black-200 @mobile:active:bg-black-200';
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
							'w-[7.1875rem] button4-medium',
							'@mobile:right-0 @mobile:text-13',
						)}
					>
						{isMyContent ? (
							<div className="flex flex-col w-full">
								<button className={clsx(`${buttonCommonClass}`, 'rounded-t-[7px]')} onClick={handleEditClick}>
									<EditIcon alt="수정하기 버튼" width={18} height={18} className="w-[18px] h-[18px] stroke-black-600" />
									수정하기
								</button>
								<button className={`${buttonCommonClass}`} onClick={handleDeleteClick}>
									<Image src="/trash.svg" alt="삭제하기 버튼" width={18} height={18} className="w-4.5 h-4.5" />
									삭제하기
								</button>
							</div>
						) : (
							<button className={clsx(`${buttonCommonClass}`, 'rounded-t-[7px]')} onClick={handleReportButtonClick}>
								<Image src="/report.svg" alt="신고하기 버튼" width={18} height={18} className="w-4.5 h-4.5" />
								신고하기
							</button>
						)}
						{isMyContent && <p className="w-[99px] h-[1px] border border-black-200 -mr-1" />}
						<button className={clsx(`${buttonCommonClass}`, 'rounded-b-[7px]')} onClick={handleShareButtonClick}>
							<Image src="/share.svg" alt="공유하기 버튼" width={18} height={18} className="w-4.5 h-4.5" />
							공유하기
						</button>
					</div>
				)}
			</div>

			{isReportModalOpen && <ReportModal type={type} pk={pk} onClose={() => setIsReportModalOpen(false)} />}

			{isDeleteConfirmOpen && (
				<AlertModal
					type="confirm"
					description="게시글을 삭제할까요?"
					onConfirm={handleConfirmDelete}
					onCancel={() => setIsDeleteConfirmOpen(false)}
				/>
			)}
			{isShareAlertVisible && (
				<AlertModal description="URL이 복사되었습니다." onCancel={() => setIsShareAlertVisible(false)} />
			)}
		</>
	);
};

export default MoreActionsButton;
