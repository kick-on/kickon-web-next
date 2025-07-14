'use client';

import clsx from 'clsx';

export default function TabBar({
	selectedTab,
	onClickButton,
}: {
	selectedTab: string;
	onClickButton: (tab: string) => void;
}) {
	const tabs = ['매치ON', '예측 결과'];

	return (
		<div>
			{/* 탭 바 */}
			<div
				className="relative w-full rounded-t-[0.625rem] bg-black-200 header-medium
				@mobile:grid @mobile:grid-cols-[92px_92px_1fr] grid grid-cols-[104px_104px_1fr]
				before:content-[''] before:absolute before:-top-1 before:-left-1 before:bottom-0 before:-right-1
				before:inset-shadow-[0px_-2px_4px_0px_rgba(0,0,0,0.10)]
				after:content-[''] after:absolute after:-bottom-4 after:left-0 after:right-0
				after:bg-black-000 after:h-4"
			>
				{tabs.map((tab) => (
					<button
						onClick={() => onClickButton(tab)}
						key={tab}
						className={clsx(
							`relative flex pt-[1.0625rem] pb-[0.9375rem] rounded-t-[0.625rem] w-full justify-center
							before:content-[''] before:absolute before:top-0 before:left-0 before:bottom-0 before:right-0
							before:bg-black-000 before:shadow-[0px_4px_6px_0px_rgba(0,0,0,0.25)] before:rounded-t-[0.625rem]`,
							selectedTab === tab ? 'before:block header-semibold text-primary-900' : 'before:hidden text-black-700',
						)}
					>
						<div className="relative z-20">{tab}</div>
					</button>
				))}
			</div>
		</div>
	);
}
