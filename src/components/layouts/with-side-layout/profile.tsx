'use client';

import ComponentFrame from '@/components/common/componentFrame';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function Profile() {
	const [isLogined, setIsLogined] = useState(true);
	return (
		<ComponentFrame>
			{isLogined ? (
				<div>
					<div className="flex p-4 justify-between border-b border-black-200">
						<div className="flex gap-3">
							<Image width={60} height={60} src="/default-profile.svg" alt="프로필 사진" />
							<div className="flex flex-col gap-[0.3125rem] mt-[0.4688rem]">
								<div className="flex gap-2">
									<div className="flex gap-1">
										<div className="body2-semibold">닉네임</div>
										<div className="body2-regular text-black-800">님</div>
									</div>
									<Image width={16} height={16} src="/team-logo/ulsan.svg" alt="팀 로고" />
								</div>
								<Link href="/setting" className="flex gap-0.5 button6-regular text-black-700 underline">
									프로필 설정
									<Image width={10} height={10} src="/chevron/right-gray.svg" alt="바로가기" />
								</Link>
							</div>
						</div>
						<button className="mr-2.5 mt-0 h-fit button6-regular text-black-700 underline">로그아웃</button>
					</div>
					<div className="grid grid-cols-2">
						<div className="flex border-r border-black-200">
							<div className="mx-auto my-[0.5625rem] text-center">
								<div className="caption2-regular h-4">이번 시즌 팀 내 순위</div>
								<div className="body4-semibold">1위</div>
							</div>
						</div>
						<div className="flex">
							<div className="mx-auto my-[0.5625rem] text-center">
								<div className="flex gap-1 caption2-regular h-4">
									지금까지 모은 포인트
									<Image width={12} height={12} src="/help-circle.svg" alt="도움말" />
								</div>
								<div className="body4-semibold">512 P</div>
							</div>
						</div>
					</div>
				</div>
			) : (
				<div className="mx-auto my-[1.8125rem] flex flex-col items-center gap-4">
					<Image width={40} height={32} src="/logo/icon-black.svg" alt="킥온" />
					<button className="flex gap-2.5 items-center w-fit px-[1.125rem] py-2.5 bg-primary-900 rounded-3xl shadow-login-button">
						<div className="text-black-000 button1-medium">간편 로그인 하기</div>
						<Image width={18} height={18} src="/chevron/right.svg" alt="바로가기" />
					</button>
				</div>
			)}
		</ComponentFrame>
	);
}
