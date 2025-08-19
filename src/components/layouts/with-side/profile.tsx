'use client';

import ComponentFrame from '@/components/common/component-frame';
import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import { useIsLoginModalOpenStore } from '@/lib/store/useIsLoginModalOpenStore';
import { getUserPointRanking } from '@/services/apis/user-point-event';
import { UserPointRankingDto } from '@/services/apis/user-point-event/dto';
import { getUserInfo } from '@/services/apis/user';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Profile() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const { openLoginModal } = useIsLoginModalOpenStore();

	const [extraUserInfo, setExtraUserInfo] = useState<Omit<UserPointRankingDto, 'userId'>>(null);
	const { currentUserInfo, setCurrentUserInfo, clearCurrentUserInfo } = useCurrentUserInfoStore();

	const fullUrl = `${pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;

	const handleLoginButtonClick = () => {
		if (pathname.split('/').includes('signup')) {
			router.push('/');
			sessionStorage.setItem('previousPage', '/');
		} else {
			sessionStorage.setItem('previousPage', fullUrl);
		}
		openLoginModal();
	};

	const handleLogoutButtonClick = () => {
		setIsLoggedIn(false);
		fetch('/api/logout', { method: 'POST' }).then(() => {
			clearCurrentUserInfo(); // 클라이언트 user info 초기화
			router.push('/');
		});
	};

	const handleProfileSettingButtonClick = () => {
		const fullUrl = `${pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
		sessionStorage.setItem('previousPage', fullUrl);
	};

	useEffect(() => {
		// 저장된 유저 정보가 없으면 jwt 기반으로 유저 정보 불러와 전역 상태 관리
		if (!currentUserInfo) {
			const getCurrentUserInfo = async () => {
				const response = await getUserInfo();

				if (typeof response === 'string') {
					console.log(response);
				} else if (response.data.privacyAgreedAt) {
					setCurrentUserInfo(response.data);
				}
			};

			getCurrentUserInfo();
		}

		// 저장된 유저 정보가 있으면 사용자 프로필 렌더링
		if (currentUserInfo) {
			const getUserPointRankingInfo = async () => {
				const response = await getUserPointRanking();

				if (typeof response === 'string') {
					console.log(response);
				} else {
					setExtraUserInfo({
						totalPoints: response.data.totalPoints,
						ranking: response.data.ranking,
					});
				}
			};

			getUserPointRankingInfo();
			setIsLoggedIn(true);
		}
	}, [currentUserInfo, setCurrentUserInfo]);

	return (
		<>
			<ComponentFrame>
				{isLoggedIn ? (
					<div>
						<div className="flex p-4 justify-between border-b border-black-200">
							<div className="flex gap-3 ">
								<div className="w-[3.75rem] h-[3.75rem] rounded-full overflow-hidden">
									<Image
										className="w-full h-full object-cover"
										width={60}
										height={60}
										src={currentUserInfo?.profileImageUrl || '/default-profile.svg'}
										alt="프로필 사진"
									/>
								</div>
								<div className="flex flex-col gap-[0.3125rem] mt-[0.4688rem]">
									<div className="flex gap-1.5 items-center">
										<div className="flex gap-0.5 h-fit items-center">
											<div className="title5-semibold">{currentUserInfo?.nickname}</div>
											{currentUserInfo?.isReporter && (
												<Image width={16} height={16} src="/reporter-mark.svg" alt="구단 기자" />
											)}
										</div>
										<Image
											className="w-4 h-4 object-contain"
											src={
												currentUserInfo?.favoriteTeams.length > 0
													? currentUserInfo?.favoriteTeams[0].logoUrl
													: '/ban.svg'
											}
											alt="팀 로고 이미지"
											width={16}
											height={16}
										/>
									</div>
									<Link
										onClick={handleProfileSettingButtonClick}
										href="/profile-setting"
										className="flex gap-0.5 button6-regular text-black-700 underline"
									>
										프로필 설정
										<Image width={10} height={10} src="/chevron/right-gray.svg" alt="바로가기" />
									</Link>
								</div>
							</div>
							<button
								onClick={handleLogoutButtonClick}
								className="mr-2.5 mt-0 h-fit button6-regular text-black-700 underline"
							>
								로그아웃
							</button>
						</div>
						<div className="grid grid-cols-2">
							<div className="flex border-r border-black-200">
								<div className="mx-auto my-[0.5625rem] text-center items-center">
									<div className="caption2-regular h-4">이번 시즌 전체 순위</div>
									<div className="body4-semibold">{extraUserInfo?.ranking || '-'}위</div>
								</div>
							</div>
							<div className="flex">
								<div className="mx-auto my-[0.5625rem] text-center">
									<div className="flex gap-1 items-center caption2-regular h-4">
										지금까지 모은 포인트
										<button
											onClick={() =>
												window.open('https://www.notion.so/devbob/1d0e7fdb8ed18034a779ee0f30e87a35', '_blank')
											}
										>
											<Image width={12} height={12} src="/help-circle.svg" alt="도움말" />
										</button>
									</div>
									<div className="body4-semibold">{extraUserInfo?.totalPoints || '-'} P</div>
								</div>
							</div>
						</div>
					</div>
				) : (
					<div className="mx-auto h-[8.8125rem] flex flex-col items-center justify-center gap-4">
						<Image width={40} height={32} src="/logo/icon-black.svg" alt="킥온" />
						<button
							onClick={handleLoginButtonClick}
							className="flex gap-2.5 items-center w-fit px-[1.125rem] py-1.5 bg-primary-900 rounded-3xl shadow-login-button"
						>
							<div className="text-black-000 button1-medium">간편 로그인 하기</div>
							<Image width={18} height={18} src="/chevron/right-white.svg" alt="바로가기" />
						</button>
					</div>
				)}
			</ComponentFrame>
		</>
	);
}
