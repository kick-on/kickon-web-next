import { ReactNode } from 'react';
import clsx from 'clsx';
import LeftSide from '@/components/layouts/with-side/left-side';
import RightSide from '@/components/layouts/with-side/right-side';
import FloatingWritingButton from '@/components/layouts/with-side/floating-writing-button';

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<div
			className={clsx(
				'pt-4 max-w-[85rem] m-auto grid gap-6 min-[1094px]:grid-cols-[auto_auto] min-[1094px]:justify-center desktop:grid-cols-[1fr_auto_1fr]',
			)}
		>
			<LeftSide />
			<main className="flex flex-col items-center gap-4">
				<div className="relative fit-content">
					{children}
					<FloatingWritingButton />
				</div>
			</main>
			<RightSide />
		</div>
	);
}
