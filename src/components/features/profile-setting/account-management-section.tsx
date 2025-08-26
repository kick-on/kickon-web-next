'use client';

import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import { setCookie } from '@/lib/utils';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function AccountManagementSection() {
	const router = useRouter();

	const { currentUserInfo } = useCurrentUserInfoStore();
	const socialLogoUrl = currentUserInfo?.providerType === 'KAKAO' ? '/sns/kakao-small.svg' : '/sns/naver-small.svg';

	return (
		<div className="relative flex flex-col gap-2">
			<div className="flex gap-1.5 items-center subtitle1-semibold">계정 관리</div>
			<div
				className="flex gap-2.5 items-center px-4 py-3 w-full @mobile:text-14
      border border-black-300 rounded-lg bg-black-100 body3-regular"
			>
				<Image width={18} height={18} src={socialLogoUrl} alt={`${currentUserInfo?.providerType} 로고`} />
				{currentUserInfo?.email}
			</div>

			<button
				onClick={() => {
					router.push('/withdrawal');
					setCookie('fromProfile', 'true', 60);
				}}
				className="absolute -bottom-8 right-0 text-black-500 button5-regular underline"
			>
				회원 탈퇴
			</button>
		</div>
	);
}
