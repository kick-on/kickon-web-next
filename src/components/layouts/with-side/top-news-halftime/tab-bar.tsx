'use client';

import clsx from 'clsx';
import { Tab } from './top-news-halftime';

export default function TabBar({ tabs, onClick }: { tabs: Tab[]; onClick: (i: number) => void }) {
	return (
		<div className="flex justify-between">
			{tabs.map(({ label, isActive }, i) => (
				<button
					key={label}
					onClick={() => onClick(i)}
					className={clsx(
						'px-2.5 py-2 border-b-3 title5-semibold',
						isActive ? 'text-primary-900 border-primary-900' : 'text-black-500 border-transparent saturate-0',
					)}
				>
					{label}
				</button>
			))}
		</div>
	);
}
