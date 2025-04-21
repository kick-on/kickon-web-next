'use client';

import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import { useIsLoginModalOpenStore } from '@/lib/store/useIsLoginModalOpenStore';
import { getUserInfo } from '@/services/auth';
import clsx from 'clsx';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UAParser } from 'ua-parser-js';

export default function LoginButton() {
	const { currentUserInfo, setCurrentUserInfo } = useCurrentUserInfoStore();
	const { openLoginModal } = useIsLoginModalOpenStore();
	const [isLoggedIn, setIsLoggedIn] = useState(!!currentUserInfo);
	const router = useRouter();
	const pathname = usePathname();

	const device = UAParser().device;
	const isMobile = device.type === 'mobile';

	const handleLoginButtonClick = () => {
		if (pathname.split('/').includes('signup')) {
			router.push('/');
		} else {
			openLoginModal();
		}
	};

	useEffect(() => {
		// 저장된 유저 정보가 없으면 jwt 기반으로 유저 정보 불러와 전역 상태 관리
		if (!currentUserInfo) {
			const getCurrentUserInfo = async () => {
				const response = await getUserInfo();

				if (typeof response === 'string') {
					console.log(response);
				} else {
					setCurrentUserInfo(response.data);
					setIsLoggedIn(true);
				}
			};

			getCurrentUserInfo();
		}
	}, [currentUserInfo, setCurrentUserInfo]);

	return (
		<>
			{isLoggedIn ? (
				<button
					onClick={() => router.push('/profile-setting')}
					className={clsx('ml-auto rounded-full', isMobile ? 'w-7 h-7' : 'w-[2.375rem] h-[2.375rem] mr-[0.3438rem]')}
				>
					<Image
						src={currentUserInfo?.profileImageUrl || '/default-profile.svg'}
						alt="프로필 이미지"
						width={isMobile ? 28 : 38}
						height={isMobile ? 28 : 38}
						objectFit="cover"
					/>
				</button>
			) : (
				<button
					onClick={handleLoginButtonClick}
					className="w-[5.5rem] h-[2.25rem] ml-auto mr-[0.3438rem] border border-black-300 rounded-3xl bg-black-000 text-primary-900 button1-medium"
				>
					로그인
				</button>
			)}
		</>
	);
}
