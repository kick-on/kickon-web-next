'use client';

import { useEffect, useRef } from 'react';

export function useObserver(callback: () => void) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const target = ref.current;
		const handler: IntersectionObserverCallback = (entries) => {
			entries.forEach((target) => {
				if (target.isIntersecting) {
					callback();
				}
			});
		};

		const options = {
			threshold: 0.5,
		};

		// 새 인스턴스 생성
		const observer = new IntersectionObserver(handler, options);

		// 대상 관찰 시작
		if (target) {
			observer.observe(target);
		}

		// 대상 관찰 종료
		return () => {
			if (target) {
				observer.disconnect();
			}
		};
	}, [callback]);

	return ref;
}
