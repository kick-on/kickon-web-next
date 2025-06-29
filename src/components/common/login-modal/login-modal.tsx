'use client';

import Image from 'next/image';
import LoginButton from './login-button';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { DOMAIN_URL, SERVER_URL } from '@/services/config/constants';

export default function LoginModal({ onClose }) {
	const router = useRouter();
	const modalRef = useRef<HTMLDivElement | null>(null);

	const handleXButtonClick = () => {
		onClose();
	};

	const handleLoginButtonClick = (provider: 'naver' | 'kakao') => {
		// api route 호출
		const redirectUrl = `${DOMAIN_URL || 'http://localhost:3000'}/api/auth/${provider}/callback`;
		router.push(`${SERVER_URL}/oauth2/authorization/${provider}?state=${redirectUrl}`);
	};

	useEffect(() => {
		const handleOutsideClick = (e: MouseEvent) => {
			if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
				onClose();
			}
		};

		document.body.classList.add('overflow-hidden');
		document.addEventListener('click', handleOutsideClick);

		return () => {
			document.body.classList.remove('overflow-hidden');
			document.removeEventListener('click', handleOutsideClick);
		};
	}, [onClose]);

	return (
		<div className="fixed z-50 @mobile:z-60 flex justify-center items-center top-0 left-0 w-full h-full bg-black/40">
			<div
				ref={modalRef}
				className="flex flex-col items-center p-6 shadow-predict-button
					w-[39.5rem] h-[39.75rem] bg-black-000 rounded-[0.625rem] display-semibold
					@mobile:w-dvw @mobile:h-dvh @mobile:rounded-none @mobile:bg-black-100
					@mobile:text-20 @mobile:font-semibold @mobile:leading-8"
			>
				<button onClick={handleXButtonClick} className="ml-auto mb-[4.6875rem] @mobile:mt-2 @mobile:mb-0">
					<Image width={24} height={24} src="/x.svg" alt="닫기" />
				</button>

				<div className="flex flex-col items-center @mobile:my-auto">
					<div className="relative w-70 h-[3.875rem] @mobile:w-54 @mobile:h-12">
						<Image fill src="/logo/kick-on-red.svg" alt="킥온 로고" />
					</div>

					<div className="mt-[1.875rem]">로그인하고 킥온과 함께</div>
					<div>좋아하는 축구팀 승부예측하러 가요!</div>

					<div className="mt-[6.625rem] flex flex-col gap-5">
						<LoginButton social="카카오" onClick={() => handleLoginButtonClick('kakao')} />
						<LoginButton social="네이버" onClick={() => handleLoginButtonClick('naver')} />
					</div>
				</div>
			</div>
		</div>
	);
}
