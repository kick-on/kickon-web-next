'use client';

import Image from 'next/image';
import LoginButton from './login-button';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { SERVER_URL } from '@/services/config/constants';

export default function LoginModal({ onClose }) {
	const router = useRouter();
	const modalRef = useRef<HTMLDivElement | null>(null);
	const previousPage = sessionStorage.getItem('previousPage');

	const handleXButtonClick = () => {
		onClose();
		router.replace(previousPage);
	};

	const handleLoginButtonClick = (provider: 'naver' | 'kakao') => {
		router.push(`${SERVER_URL}/oauth2/authorization/${provider}?state=http://localhost:3000/login/${provider}`);
	};

	useEffect(() => {
		const handleOutsideClick = (e: MouseEvent) => {
			if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
				onClose();
				router.replace(previousPage);
			}
		};

		document.addEventListener('click', handleOutsideClick);
		document.body.style.overflow = 'hidden';

		return () => {
			document.removeEventListener('click', handleOutsideClick);
			document.body.style.overflow = 'unset';
		};
	}, [onClose, router, previousPage]);

	return (
		<div className="fixed z-50 flex justify-center items-center top-0 left-0 w-full h-full bg-black/40">
			<div
				ref={modalRef}
				className="flex flex-col items-center p-6 shadow-predict-button
            w-[39.5rem] h-[39.75rem] bg-black-000 rounded-[0.625rem] display-semibold"
			>
				<button onClick={handleXButtonClick} className="ml-auto mb-[4.6875rem]">
					<Image width={24} height={24} src="/x.svg" alt="닫기" />
				</button>
				<Image width={280} height={62} src="/logo/kick-on-mixed.svg" alt="킥온 로고" />

				<div className="mt-[1.875rem]">로그인하고 킥온과 함께</div>
				<div>좋아하는 축구팀 승부예측하러 가요!</div>

				<div className="mt-[6.625rem] flex flex-col gap-5">
					<LoginButton social="카카오" onClick={() => handleLoginButtonClick('kakao')} />
					<LoginButton social="네이버" onClick={() => handleLoginButtonClick('naver')} />
				</div>
			</div>
		</div>
	);
}
