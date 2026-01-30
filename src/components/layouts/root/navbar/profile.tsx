'use client';

import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import { getUserPointRanking } from '@/services/apis/user-point-event/user-point-event.api';
import { UserPointRankingDto } from '@/services/apis/user-point-event/user-point-event.type';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Divider from '../mobile-navbar/sidebar/divider';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import clsx from 'clsx';
import Instagram from '@/assets/sns/instagram.svg';
import X from '@/assets/sns/x.svg';
import useAuthStore from '@/lib/store/useAuthStore';

export default function Profile({ onClickButton }: { onClickButton: () => void }) {
	const { currentUserInfo, clearCurrentUserInfo } = useCurrentUserInfoStore();
	const { clearToken } = useAuthStore();

	const [extraUserInfo, setExtraUserInfo] = useState<Omit<UserPointRankingDto, 'userId'>>(null);
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const handleLogoutButtonClick = () => {
		onClickButton();
		fetch('/api/logout', { method: 'POST' }).then(() => {
			clearCurrentUserInfo(); // 클라이언트 user info 초기화
			clearToken();
			router.push('/');
		});
	};

	const handleLinkClick = () => {
		// previous page 설정
		const fullUrl = `${pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
		sessionStorage.setItem('previousPage', fullUrl);

		// 모달 or 사이드바 닫기
		setTimeout(onClickButton, 200);
	};

	useEffect(() => {
		if (currentUserInfo) {
			const getUserPointRankingInfo = async () => {
				const response = await getUserPointRanking();
				setExtraUserInfo({
					totalPoints: response.data.totalPoints,
					ranking: response.data.ranking,
				});
			};

			getUserPointRankingInfo();
		}
	}, [currentUserInfo]);

	if (!currentUserInfo) return;

	return (
		<>
			<div className="flex flex-col gap-4">
				<div className="px-1.5 flex flex-col gap-3">
					<div className="flex items-center">
						<Image
							className="@mobile:w-9 @mobile:h-9 @mobile:mr-2 mr-3 w-12 h-12 object-cover rounded-full"
							src={currentUserInfo.profileImageUrl || '/default-profile.svg'}
							alt=""
							width={36}
							height={36}
						/>
						<div className="flex gap-0.5 items-center mr-1.5 body2-semibold @mobile:text-18">
							{currentUserInfo.nickname}
							{currentUserInfo.isReporter && <Image width={16} height={16} src="/reporter-mark.svg" alt="구단 기자" />}
						</div>
						<Image
							className="w-4 h-4 object-contain"
							src={currentUserInfo.favoriteTeams.length > 0 ? currentUserInfo.favoriteTeams[0].logoUrl : '/ban.svg'}
							alt=""
							width={16}
							height={16}
						/>
					</div>
					<button
						onClick={handleLogoutButtonClick}
						className="ml-auto text-black-600 body5-regular underline @mobile:text-12"
					>
						로그아웃
					</button>
				</div>

				<Divider />

				<div className="flex flex-col gap-3 px-1.5 body4-semibold">
					<div className="flex justify-between items-center">
						<span className="body5-regular @mobile:text-12">이번 시즌 전체 순위</span>
						{extraUserInfo?.ranking || '- '}위
					</div>
					<div className="flex justify-between items-center">
						<span className="flex gap-1 items-center body5-regular @mobile:text-12">
							지금까지 모은 포인트
							<button
								aria-label={'포인트 설명으로 이동'}
								onClick={() => window.open('https://www.notion.so/devbob/1d0e7fdb8ed18034a779ee0f30e87a35', '_blank')}
							>
								<Image
									aria-hidden={true}
									className="@mobile:w-3 @mobile:h-3 w-4 h-4"
									width={12}
									height={12}
									src="/help-circle.svg"
									alt={''}
								/>
							</button>
						</span>
						{extraUserInfo?.totalPoints || '-'} P
					</div>
				</div>

				<Divider />

				<Link
					onClick={handleLinkClick}
					href={'/profile-setting'}
					className={clsx('w-[calc(100%+32px)] -ml-4 mt-4 py-2.5 px-5.5 active:bg-black-200 transition-colors', {
						'text-primary-900 button2-semibold': pathname === '/profile-setting',
					})}
				>
					프로필 설정
				</Link>
			</div>

			<div className="absolute bottom-[1.875rem] @mobile:bottom-15 left-1/2 -translate-x-1/2 w-full flex flex-col items-center gap-6">
				<div className="@mobile:hidden w-full mb-1.5 px-4">
					<Divider />
				</div>

				<span className="body6-medium">팔로우하고 소식을 받아보세요!</span>
				<div className="flex gap-8">
					<button
						aria-label={'인스타그램으로 이동'}
						onClick={() => window.open('https://www.instagram.com/kickonfc/', '_blank')}
					>
						<Instagram className="w-6 h-6 object-contain" src={'/sns/instagram.svg'} alt="" />
					</button>
					<button aria-label={'X로 이동'} onClick={() => window.open('https://x.com/kickonfc', '_blank')}>
						<X className="w-6 h-6 object-contain" src={'/sns/x.svg'} alt="" />
					</button>
				</div>
			</div>
		</>
	);
}
