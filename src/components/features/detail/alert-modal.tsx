'use client';

import useIsMobile from '@/lib/hooks/useIsMobile';
import clsx from 'clsx';
import { useEffect, useRef } from 'react';

interface AlertModalProps {
	type?: 'confirm' | 'info';
	description: string;
	confirmText?: string;
	cancelText?: string;
	onConfirm?: () => void;
	onCancel?: () => void;
}

const AlertModal = ({
	type = 'confirm',
	description,
	confirmText = '확인',
	cancelText = '취소',
	onConfirm,
	onCancel,
}: AlertModalProps) => {
	const isMobile = useIsMobile();
	const confirmButtonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (type === 'confirm') {
			const timer = setTimeout(() => {
				confirmButtonRef.current?.focus();
			}, 100);
			return () => clearTimeout(timer);
		}
	}, [type]);

	const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget && onCancel) {
			onCancel();
		}
	};

	if (isMobile === null) return null;

	return (
		<div onClick={handleBackdropClick} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
			<div
				onClick={(e) => e.stopPropagation()}
				className={clsx(
					'flex flex-col justify-center bg-black-000 rounded-lg px-7 w-[344px] @mobile:w-77.75',
					isMobile ? 'pt-[50px] pb-8 gap-[42px]' : 'pt-[68px] pb-[36px] gap-[54px]',
				)}
			>
				<p className={clsx('body2-semibold @mobile:text-18 text-center text-black-900', type === 'info' && 'text-lg')}>
					{description}
				</p>

				<div
					className={clsx(
						'button2-semibold @mobile:text-15 w-full flex',
						type === 'confirm' ? 'justify-end gap-4' : 'justify-center',
					)}
				>
					{type === 'confirm' ? (
						<>
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
						</>
					) : (
						<button
							ref={confirmButtonRef}
							onClick={onCancel}
							className="w-full px-4 py-2.5 bg-primary-900 text-black-000 rounded-md"
						>
							{confirmText}
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default AlertModal;
