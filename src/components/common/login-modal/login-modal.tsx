'use client';

import Image from 'next/image';
import LoginButton from './login-button';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginModal({ onClose }) {
	const modalRef = useRef<HTMLDivElement | null>(null);
	const router = useRouter();

	useEffect(() => {
		const handleOutsideClick = (e: MouseEvent) => {
			if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
				onClose();
				router.replace('/');

				// 뒤로 가기 히스토리를 없애기 위해 replaceState 사용
				window.history.replaceState(null, '', '/');
			}
		};

		document.addEventListener('click', handleOutsideClick);
		document.body.style.overflow = 'hidden';

		return () => {
			document.removeEventListener('click', handleOutsideClick);
			document.body.style.overflow = 'unset';
		};
	}, [onClose, router]);

	return (
		<div className="fixed z-50 flex justify-center items-center top-0 left-0 w-full h-full bg-black/40">
			<div
				ref={modalRef}
				className="flex flex-col items-center p-6 shadow-predict-button
            w-[39.5rem] h-[39.75rem] bg-black-000 rounded-[0.625rem] display-semibold"
			>
				<button onClick={onClose} className="ml-auto mb-[4.6875rem]">
					<Image width={24} height={24} src="/x.svg" alt="닫기" />
				</button>
				<Image width={280} height={62} src="/logo/kick-on-mixed.svg" alt="킥온 로고" />

				<div className="mt-[1.875rem]">로그인하고 킥온과 함께</div>
				<div>좋아하는 축구팀 승부예측하러 가요!</div>

				<div className="mt-[6.625rem] flex flex-col gap-5">
					<LoginButton social="카카오" onClick={() => {}} />
					<LoginButton social="네이버" onClick={() => {}} />
				</div>
			</div>
		</div>
	);
}
