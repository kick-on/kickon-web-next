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
			const previousPage = sessionStorage.getItem('previousPage');
			router.replace(previousPage ?? '/');
		}
	}, [shouldRedirect, router]);

	return <>{children}</>;
}
