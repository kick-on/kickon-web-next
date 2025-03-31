'use client';

import { useCurrentUserInfoStore } from '@/lib/store/useCurrentUserInfoStore';
import { getUserInfo } from '@/services/auth';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
	const router = useRouter();
	const pathParams = useParams();
	const searchParams = useSearchParams();
	const provider = pathParams?.provider;
	const accessToken = searchParams.get('accessToken');

	const { setCurrentUserInfo } = useCurrentUserInfoStore();

	useEffect(() => {
		const getCurrentUserInfo = async () => {
			const response = await getUserInfo();

			if (typeof response === 'string') {
				// 유저 정보 불러오기 실패(401) 시 회원가입 페이지로
				router.push(`/signup?provider=${provider}`);
			} else {
				// 유저 정보 불러오기 성공 시 홈으로
				setCurrentUserInfo(response.data);
				localStorage.setItem('accessToken', accessToken);

				router.replace('/');
				window.history.replaceState(null, '', '/'); // 뒤로가기 제어
			}
		};

		getCurrentUserInfo();
	}, [router, accessToken, setCurrentUserInfo, provider]);
}
