'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import useIsMobile from '@/lib/hooks/useIsMobile';

export default function MobileGate({ children }: { children: React.ReactNode }) {
	const isMobile = useIsMobile();
	const router = useRouter();
	const hasAlerted = useRef(false);

	useEffect(() => {
		if (isMobile === null) return; // 모바일 여부 판별 전이면 대기

		if (!isMobile && !hasAlerted.current) {
			alert('모바일에서만 접근 가능합니다.');
			hasAlerted.current = true;
			router.replace('/');
		}
	}, [isMobile, router]);

	// 모바일 여부가 확인되기 전에는 렌더 차단
	if (!isMobile) return null;

	return <>{children}</>;
}
