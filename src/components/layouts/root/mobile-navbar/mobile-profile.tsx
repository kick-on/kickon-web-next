'use client';

import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import { getUserPointRanking } from '@/services/apis/user-point-event';
import { UserPointRankingDto } from '@/services/apis/user-point-event/dto';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Divider } from '.';
import { useRouter } from 'next/navigation';

export default function MobileProfile() {
	const { currentUserInfo, clearCurrentUserInfo } = useCurrentUserInfoStore();
	const [extraUserInfo, setExtraUserInfo] = useState<Omit<UserPointRankingDto, 'userId'>>(null);
	const router = useRouter();

	const handleLogoutButtonClick = () => {
		clearCurrentUserInfo();
		localStorage.clear();

		router.push('/');
	};

	useEffect(() => {
		if (currentUserInfo) {
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

	return currentUserInfo ? (
		<div>
			<div className="mt-8 px-[1.375rem] flex flex-col gap-3">
				<div className="flex gap-2 items-center">
					<Image
						className="w-9 h-9 object-cover rounded-full"
						src={currentUserInfo.profileImageUrl || '/default-profile.svg'}
						alt="프로필 이미지"
						width={36}
						height={36}
					/>
					<div className="flex gap-1 items-center title4-semibold">
						{currentUserInfo.nickname}
						<span className="body3-regular text-black-800">님</span>
					</div>
					{currentUserInfo.favoriteTeam && (
						<Image
							className="w-4 h-4 object-contain"
							src={currentUserInfo.favoriteTeam.logoUrl}
							alt="팀 로고 이미지"
							width={16}
							height={16}
						/>
					)}
				</div>
				<button onClick={handleLogoutButtonClick} className="ml-auto text-black-600 button5-regular underline">
					로그아웃
				</button>
			</div>

			<Divider />

			<div className="flex flex-col gap-3 px-[1.375rem] body4-semibold">
				<div className="flex justify-between items-center">
					<span className="body7-regular">이번 시즌 {currentUserInfo?.favoriteTeam ? '우리 팀 내' : '전체'} 순위</span>
					{extraUserInfo?.ranking || '- '}위
				</div>
				<div className="flex justify-between items-center">
					<span className="flex gap-1 items-center body7-regular">
						지금까지 모은 포인트
						<button
							onClick={() => window.open('https://www.notion.so/devbob/1d0e7fdb8ed18034a779ee0f30e87a35', '_blank')}
						>
							<Image width={12} height={12} src="/help-circle.svg" alt="도움말" />
						</button>
					</span>
					{extraUserInfo?.totalPoints || '-'} P
				</div>
			</div>

			<Divider />
		</div>
	) : null;
}
