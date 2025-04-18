'use client';

import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import { getUserInfo } from '@/services/auth';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginButton({ onClick }: { onClick: () => void }) {
	const { currentUserInfo, setCurrentUserInfo } = useCurrentUserInfoStore();
	const [isLoggedIn, setIsLoggedIn] = useState(!!currentUserInfo);
	const router = useRouter();

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
			setIsLoggedIn(true);
		}
	}, [currentUserInfo, setCurrentUserInfo]);

	return (
		<>
			{isLoggedIn ? (
				<button
					onClick={() => router.push('/profile-setting')}
					className="w-[2.375rem] h-[2.375rem] mr-[0.3438rem] rounded-full"
				>
					<Image
						src={currentUserInfo?.profileImageUrl || '/default-profile.svg'}
						alt="프로필 이미지"
						width={38}
						height={38}
						objectFit="cover"
					/>
				</button>
			) : (
				<button
					onClick={onClick}
					className="w-[5.5rem] h-[2.25rem] mr-[0.3438rem] border border-black-300 rounded-3xl bg-black-000 text-primary-900 button1-medium"
				>
					로그인
				</button>
			)}
		</>
	);
}
