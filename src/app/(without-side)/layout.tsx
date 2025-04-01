import WhiteBox from '@/components/layouts/without-side/white-box';
import { Suspense } from 'react';

export default function WithoutSideLayout({ children }: { children: React.ReactNode }) {
	return (
		<WhiteBox>
			<Suspense>{children}</Suspense>
		</WhiteBox>
	);
}
