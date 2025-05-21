'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RedirectWrapper({
	children,
	shouldRedirect,
}: {
	children: React.ReactNode;
	shouldRedirect: boolean;
}) {
	const router = useRouter();

	useEffect(() => {
		if (shouldRedirect) {
			alert(`로그인이 필요한 서비스입니다.\n로그인 후 이용해 주세요.`);
			const previousPage = sessionStorage.getItem('previousPage');
			router.replace(previousPage ?? '/');
		}
	}, [shouldRedirect, router]);

	return <>{children}</>;
}
