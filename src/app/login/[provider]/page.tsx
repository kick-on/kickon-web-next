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

	const { setCurrentUserInfo } = useCurrentUserInfoStore();

	useEffect(() => {
		const accessToken = searchParams.get('accessToken');
		const refreshToken = searchParams.get('refreshToken');
		console.log('accesstoken: ', accessToken);

		if (accessToken && refreshToken) {
			localStorage.setItem('accessToken', accessToken);
			localStorage.setItem('refreshToken', refreshToken);
		}

		const getCurrentUserInfo = async () => {
			const response = await getUserInfo();

			if (typeof response === 'string') {
				// 유저 정보 불러오기 실패(401/403) 시 회원가입 페이지로
				router.push(`/signup?provider=${provider}`);
			} else {
				// 유저 정보 불러오기 성공 시 이전 페이지로로
				setCurrentUserInfo(response.data);

				const previousPage = sessionStorage.getItem('previousPage');
				router.replace(previousPage);
			}
		};

		getCurrentUserInfo();
	}, [router, searchParams, setCurrentUserInfo, provider]);
}
