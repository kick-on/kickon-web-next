import { ReactNode } from 'react';
import LeftSide from '@/components/layouts/with-side/left-side';
import RightSide from '@/components/layouts/with-side/right-side';
import FloatingWritingButton from '@/components/layouts/with-side/floating-writing-button';

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<div
			className="pt-4 max-w-[85rem] m-auto grid gap-6 desktop:grid-cols-[1fr_auto_1fr]
				min-[1094px]:grid-cols-[auto_auto] min-[1094px]:justify-center"
		>
			<LeftSide />
			<main className="flex flex-col items-center gap-4">
				<div className="relative @mobile:w-dvw">
					{children}
					<FloatingWritingButton />
				</div>
			</main>
			<RightSide />
		</div>
	);
}
