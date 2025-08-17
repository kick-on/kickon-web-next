'use client';

import useIsMobile from '@/lib/hooks/useIsMobile';
import clsx from 'clsx';
import { useEffect, useRef } from 'react';

interface AlertModalProps {
	type?: 'info' | 'alert' | 'confirm';
	description: string | React.ReactNode;
	confirmButtonText?: string;
	cancelButtonText?: string;
	onConfirm?: () => void;
	onCancel?: () => void;
}

const AlertModal = ({
	type = 'info',
	description,
	confirmButtonText = '확인',
	cancelButtonText = '취소',
	onConfirm,
	onCancel,
}: AlertModalProps) => {
	const isMobile = useIsMobile();
	const confirmButtonRef = useRef<HTMLButtonElement>(null);

	// info 모달일 때 자동 닫힘 처리
	useEffect(() => {
		if (type === 'info' && onCancel) {
			const timer = setTimeout(() => {
				onCancel();
			}, 2000);
			return () => clearTimeout(timer);
		}

		if ((type === 'alert' || type === 'confirm') && confirmButtonRef.current) {
			const timer = setTimeout(() => {
				confirmButtonRef.current?.focus(); // 확인 버튼에 자동 포커싱
			}, 100);
			return () => clearTimeout(timer);
		}
	}, [type, onCancel]);

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
				className={clsx('flex flex-col justify-center bg-black-000 rounded-lg px-7 w-[344px] @mobile:w-77.75', {
					// type이 'info'일 때
					'h-25': type === 'info',

					// type이 'info'가 아닐 때
					'pt-3 pb-8 h-[14.125rem] @mobile:h-48': type !== 'info' && isMobile,
					'pt-4 pb-8 h-[14.125rem] @mobile:h-48': type !== 'info' && !isMobile,
				})}
			>
				<p className="my-auto text-body-03 text-18 @mobile:text-16 font-semibold text-center text-black-900 whitespace-pre-line">
					{description}
				</p>

				{type === 'alert' && (
					<div className="button2-semibold @mobile:text-15 w-full flex justify-center">
						<button
							ref={confirmButtonRef}
							onClick={onConfirm}
							className="w-full px-4 py-2.5 bg-primary-900 text-black-000 rounded-md"
						>
							{confirmButtonText}
						</button>
					</div>
				)}

				{type === 'confirm' && (
					<div className="button2-semibold @mobile:text-15 w-full flex justify-end gap-4">
						<button onClick={onCancel} className="w-1/2 p-[10px] bg-black-200 text-black-700 rounded-md">
							{cancelButtonText}
						</button>
						<button
							ref={confirmButtonRef}
							onClick={onConfirm}
							className="w-1/2 px-4 py-2.5 bg-primary-900 text-black-000 rounded-md"
						>
							{confirmButtonText}
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default AlertModal;
