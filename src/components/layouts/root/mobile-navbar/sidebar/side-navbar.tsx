'use client';

import clsx from 'clsx';
import Link from 'next/link';
import Image from 'next/image';
import { NavButton } from '../../navbar';

export default function SideNavbar({
	onClickButton,
	navButtons,
}: {
	onClickButton: () => void;
	navButtons: NavButton[];
}) {
	return (
		<div className="flex flex-col justify-between h-full">
			<nav className="flex flex-col gap-2">
				{navButtons.map(
					(button) =>
						button && (
							<Link
								onClick={() => setTimeout(onClickButton, 200)}
								key={button.content}
								href={button.href}
								className={clsx('w-[calc(100%+32px)] -ml-4 py-2.5 px-5.5 active:bg-black-200 transition-colors', {
									'text-primary-900 button2-semibold': button.isActive,
								})}
							>
								{button.content}
							</Link>
						),
				)}
			</nav>

			<div
				aria-hidden={true}
				className="absolute z-10 -bottom-[3.625rem] right-31 @mobile:right-9 w-[23rem] @mobile:w-[15.9375rem] aspect-[31/25] opacity-[0.08]"
			>
				<Image className="w-auto h-auto object-contain" src={'/logo/icon-red.svg'} alt="" fill />
			</div>
		</div>
	);
}
