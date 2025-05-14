'use client';

import useIsMobile from '@/lib/hooks/useIsMobile';
import clsx from 'clsx';
import { useEffect, useRef } from 'react';

interface ConfirmModalProps {
	description: string;
	confirmText?: string;
	cancelText?: string;
	onConfirm: () => void;
	onCancel: () => void;
}

const ConfirmModal = ({
	description,
	confirmText = '확인',
	cancelText = '취소',
	onConfirm,
	onCancel,
}: ConfirmModalProps) => {
	const isMobile = useIsMobile();
	const confirmButtonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		const timer = setTimeout(() => {
			confirmButtonRef.current?.focus();
		}, 100); // 모바일에서 포커싱 자연스럽게

		return () => clearTimeout(timer);
	}, []);

	const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) {
			onCancel();
		}
	};

	return (
		<div onClick={handleBackdropClick} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
			<div
				onClick={(e) => e.stopPropagation()}
				className={clsx(
					'flex flex-col justify-center bg-black-000 rounded-lg px-7 w-[344px] @mobile:w-77.75',
					isMobile ? 'pt-[50px] pb-8 gap-[42px]' : 'pt-[68px] pb-[36px] gap-[54px]',
				)}
			>
				<p className="body2-semibold @mobile:text-18 text-center text-black-900">{description}</p>
				<div className="flex justify-end gap-4 button2-semibold @mobile:text-15 w-full">
					<button onClick={onCancel} className="w-1/2 p-[10px] bg-black-200 text-black-700 rounded-md">
						{cancelText}
					</button>
					<button
						ref={confirmButtonRef}
						onClick={onConfirm}
						className="w-1/2 px-4 py-2.5 bg-primary-900 text-black-000 rounded-md"
					>
						{confirmText}
					</button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmModal;
