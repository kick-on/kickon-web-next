'use client';
import clsx from 'clsx';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import AlertModal from '../alert-modal';

interface CommentMoreButtonProps {
	onEditClick: () => void;
	onDeleteClick: () => void;
}

export function CommentMoreButton({ onEditClick, onDeleteClick }: CommentMoreButtonProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

	const menuRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);

	const handleDeleteClick = () => {
		setIsOpen(false); // 메뉴 닫기
		setIsDeleteConfirmOpen(true); // 모달 열기
	};

	// 확인 누를 때 실행될 함수
	const handleConfirmDelete = () => {
		onDeleteClick(); // 삭제
		setIsDeleteConfirmOpen(false); // 모달 닫기
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const menuEl = menuRef.current;
			const buttonEl = buttonRef.current;

			if (menuEl && buttonEl && !menuEl.contains(event.target as Node) && !buttonEl.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener('click', handleClickOutside);
		}

		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, [isOpen]);

	const buttonCommonClass =
		'block w-full text-center px-[27px] py-[10px] whitespace-nowrap @mobile:px-[30px] @mobile:py-[15px] hover:bg-black-200 @mobile:active:bg-black-200';
	return (
		<div className="relative inline-block">
			<button ref={buttonRef} onClick={() => setIsOpen((prev) => !prev)} className="flex items-center pl-1">
				<Image src="/more-horizontal.svg" alt="더보기" width={18} height={18} className="@mobile:w-4.5 @mobile:h-4.5" />
			</button>
			{isOpen && (
				<div
					ref={menuRef}
					className={clsx(
						'absolute z-50 mt-2 flex flex-col rounded-lg border border-black-300 bg-black-000 text-black-900 button4-medium @mobile:text-13 shadow-[0_4px_10px_0_rgba(0,0,0,0.16)]',
						'w-[6.5625rem]',
						'@mobile:right-0',
					)}
				>
					<button
						className={clsx(`${buttonCommonClass}`, 'rounded-t-[7px]')}
						onClick={() => {
							setIsOpen(false);
							onEditClick();
						}}
					>
						수정하기
					</button>
					<button className={clsx(`${buttonCommonClass}`, 'rounded-b-[7px]')} onClick={handleDeleteClick}>
						삭제하기
					</button>
				</div>
			)}
			{isDeleteConfirmOpen && (
				<AlertModal
					type="confirm"
					description="댓글을 삭제할까요?"
					onConfirm={handleConfirmDelete}
					onCancel={() => setIsDeleteConfirmOpen(false)}
				/>
			)}
		</div>
	);
}
