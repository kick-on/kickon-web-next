'use client';

import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import { getUserPointRanking } from '@/services/apis/user-point-event';
import { UserPointRankingDto } from '@/services/apis/user-point-event/dto';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Divider from '../mobile-navbar/sidebar/divider';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import clsx from 'clsx';

export default function Profile({ onClickButton }: { onClickButton: () => void }) {
	const { currentUserInfo, clearCurrentUserInfo } = useCurrentUserInfoStore();
	const [extraUserInfo, setExtraUserInfo] = useState<Omit<UserPointRankingDto, 'userId'>>(null);
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const handleLogoutButtonClick = () => {
		onClickButton();
		fetch('/api/logout', { method: 'POST' }).then(() => {
			clearCurrentUserInfo(); // 클라이언트 user info 초기화
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
		}
	}, [currentUserInfo]);

	if (!currentUserInfo) return;

	return (
		<>
			<div className="flex flex-col gap-4">
				<div className="px-1.5 flex flex-col gap-3">
					<div className="flex gap-2 items-center">
						<Image
							className="@mobile:w-9 @mobile:h-9 @mobile:mr-0 mr-1 w-12 h-12 object-cover rounded-full"
							src={currentUserInfo.profileImageUrl || '/default-profile.svg'}
							alt="프로필 이미지"
							width={36}
							height={36}
						/>
						<div className="flex gap-1 items-center body2-semibold @mobile:text-18">
							{currentUserInfo.nickname}
							<span className="body2-regular text-black-800 @mobile:text-16">님</span>
						</div>
						<Image
							className="w-4 h-4 object-contain"
							src={currentUserInfo.favoriteTeams.length > 0 ? currentUserInfo.favoriteTeams[0].logoUrl : '/ban.svg'}
							alt="팀 로고 이미지"
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
								onClick={() => window.open('https://www.notion.so/devbob/1d0e7fdb8ed18034a779ee0f30e87a35', '_blank')}
							>
								<Image
									className="@mobile:w-3 @mobile:h-3 w-4 h-4"
									width={12}
									height={12}
									src="/help-circle.svg"
									alt="도움말"
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
						onClick={() => window.open('https://www.instagram.com/kickonfc/', '_blank')}
						className="relative w-6 h-6"
					>
						<Image className="w-auto h-auto object-contain" fill src={'/sns/instagram.svg'} alt="인스타그램 아이콘" />
					</button>
					<button onClick={() => window.open('https://x.com/kickonfc', '_blank')} className="relative w-6 h-6">
						<Image className="w-auto h-auto object-contain" fill src={'/sns/x.svg'} alt="트위터 아이콘" />
					</button>
				</div>
			</div>
		</>
	);
}
