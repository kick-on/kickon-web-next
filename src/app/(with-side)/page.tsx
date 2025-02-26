'use client';

import ComponentFrame from '@/components/common/componentFrame';
import { useEffect } from 'react';

export default function Home() {
	useEffect(() => {
		document.body.style.backgroundColor = 'var(--color-black-800)';

		return () => {
			document.body.style.backgroundColor = 'var(--color-black-100)';
		};
	}, []);

	return (
		<ComponentFrame isMain={true}>
			<div>홈페이지</div>
			<div>홈페이지</div>
			<div>홈페이지</div>
			<div>홈페이지</div>
			<div>홈페이지</div>
			<div>홈페이지</div>
			<div>홈페이지</div>
			<div>홈페이지</div>
			<div>홈페이지</div>
			<div>홈페이지</div>
			<div>홈페이지</div>
			<div>홈페이지</div>
			<div>홈페이지</div>
			<div>홈페이지</div>
			<div>홈페이지</div>
			<div>홈페이지</div>
		</ComponentFrame>
	);
}
