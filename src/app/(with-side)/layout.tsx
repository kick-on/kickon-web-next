import { ReactNode, Suspense } from 'react';
import LeftSide from '@/components/layouts/with-side/left-side';
import FloatingWritingButton from '@/components/layouts/with-side/floating-writing-button';

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<div
			className="pt-4 m-auto grid gap-6 desktop:grid-cols-[auto_auto]
				min-[1094px]:grid-cols-[auto_auto] min-[1094px]:justify-center"
		>
			<LeftSide />
			<main className="flex flex-col items-center gap-4">
				<div className="relative @mobile:w-dvw @mobile:px-4">
					{children}
					<Suspense>
						<FloatingWritingButton />
					</Suspense>
				</div>
			</main>
			{/*<RightSide />*/}
		</div>
	);
}
