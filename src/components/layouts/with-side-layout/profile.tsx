'use client';

import ComponentFrame from '@/components/common/componentFrame';
import LoginModal from '@/components/common/login-modal/login-modal';
import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import { getUserPointRanking } from '@/services/apis/user-point-event';
import { UserPointRankingDto } from '@/services/apis/user-point-event/dto';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Profile() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [extraUserInfo, setExtraUserInfo] = useState<Omit<UserPointRankingDto, 'userId'>>(null);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isLoginModalOpen, setIsLoginModalOpen] = useState(!!searchParams.get('q'));

	const { currentUserInfo } = useCurrentUserInfoStore();

	const handleLoginButtonClick = () => {
		setIsLoginModalOpen(true);
	};

	const handleLoginModalClose = () => {
		setIsLoginModalOpen(false);
	};

	const handleLogoutButtonClick = () => {
		localStorage.clear();
		router.push('/');
	};

	useEffect(() => {
		if (currentUserInfo) {
			setIsLoggedIn(true);

			const getExtraUserInfo = async () => {
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

			getExtraUserInfo();
		}
	}, [currentUserInfo]);

	return (
		<>
			{isLoginModalOpen && <LoginModal onClose={handleLoginModalClose} />}
			<ComponentFrame>
				{isLoggedIn ? (
					<div>
						<div className="flex p-4 justify-between border-b border-black-200">
							<div className="flex gap-3">
								<Image width={60} height={60} src="/default-profile.svg" alt="프로필 사진" />
								<div className="flex flex-col gap-[0.3125rem] mt-[0.4688rem]">
									<div className="flex gap-2">
										<div className="flex gap-1 h-fit">
											<div className="body2-semibold">{currentUserInfo.nickname}</div>
											<div className="body2-regular text-black-800">님</div>
										</div>
										{currentUserInfo.teamName && (
											<Image
												width={16}
												height={16}
												src={currentUserInfo.teamLogoUrl}
												alt={`${currentUserInfo.teamName} 로고`}
											/>
										)}
									</div>
									<Link href="/profile-setting" className="flex gap-0.5 button6-regular text-black-700 underline">
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
									<div className="caption2-regular h-4">
										이번 시즌 {currentUserInfo.teamName ? '우리 팀 내' : '전체'} 순위
									</div>
									<div className="body4-semibold">{extraUserInfo?.ranking || '-'}위</div>
								</div>
							</div>
							<div className="flex">
								<div className="mx-auto my-[0.5625rem] text-center">
									<div className="flex gap-1 items-center caption2-regular h-4">
										지금까지 모은 포인트
										<button>
											<Image width={12} height={12} src="/help-circle.svg" alt="도움말" />
										</button>
									</div>
									<div className="body4-semibold">{extraUserInfo?.totalPoints || '-'} P</div>
								</div>
							</div>
						</div>
					</div>
				) : (
					<div className="mx-auto my-[1.8125rem] flex flex-col items-center gap-4">
						<Image width={40} height={32} src="/logo/icon-black.svg" alt="킥온" />
						<button
							onClick={handleLoginButtonClick}
							className="flex gap-2.5 items-center w-fit px-[1.125rem] py-2.5 bg-primary-900 rounded-3xl shadow-login-button"
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
