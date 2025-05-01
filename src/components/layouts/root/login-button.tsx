'use client';

import useIsMobile from '@/lib/hooks/useIsMobile';
import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import { useIsLoginModalOpenStore } from '@/lib/store/useIsLoginModalOpenStore';
import { getUserInfo } from '@/services/auth';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginButton({ onClickProfile }: { onClickProfile?: () => void }) {
	const { currentUserInfo, setCurrentUserInfo } = useCurrentUserInfoStore();
	const { openLoginModal } = useIsLoginModalOpenStore();
	const [isLoggedIn, setIsLoggedIn] = useState(!!currentUserInfo);

	const isMobile = useIsMobile();
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const fullUrl = `${pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;

	const handleLoginButtonClick = () => {
		if (pathname.split('/').includes('signup')) {
			sessionStorage.setItem('previousPage', '/');
			router.push('/');
		} else {
			sessionStorage.setItem('previousPage', fullUrl);
		}
		openLoginModal();
	};

	const handleProfileButtonClick = () => {
		if (isMobile) {
			onClickProfile();
		} else {
			router.push('/profile-setting');
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
				}
			};

			getCurrentUserInfo();
		}
		setIsLoggedIn(!!currentUserInfo);
	}, [currentUserInfo, setCurrentUserInfo]);

	return (
		<>
			{isLoggedIn ? (
				<button
					onClick={handleProfileButtonClick}
					className={'ml-auto rounded-full w-[2.375rem] h-[2.375rem] mr-[0.3438rem] @mobile:w-7 @mobile:h-7'}
				>
					<Image
						src={currentUserInfo?.profileImageUrl || '/default-profile.svg'}
						alt="프로필 이미지"
						width={isMobile ? 28 : 38}
						height={isMobile ? 28 : 38}
						className="w-full h-full rounded-full object-cover"
					/>
				</button>
			) : (
				<button
					onClick={handleLoginButtonClick}
					className="ml-auto mr-[0.3438rem] border border-black-300 rounded-3xl bg-black-000 text-primary-900
						w-[5.5rem] h-[2.25rem] button1-medium @mobile:w-[3.8125rem] @mobile:h-7 @mobile:text-14 @mobile:font-medium"
				>
					로그인
				</button>
			)}
		</>
	);
}
