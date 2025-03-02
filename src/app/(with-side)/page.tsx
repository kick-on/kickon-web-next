'use client';

import ComponentFrame from '@/components/common/componentFrame';
import InProgress from '@/components/features/home/in-progress';
import { useEffect } from 'react';

export default function Home() {
	useEffect(() => {
		document.body.style.backgroundColor = 'var(--color-black-800)';

		return () => {
			document.body.style.backgroundColor = 'var(--color-black-100)';
		};
	}, []);

	return (
		<ComponentFrame isMain={true} hasBorder={false}>
			<InProgress />
		</ComponentFrame>
	);
}
