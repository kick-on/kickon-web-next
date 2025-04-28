'use client';

import clsx from 'clsx';
import { useState } from 'react';

export default function ScoreButton() {
	const [isScrollVisible, setIsScrollVisible] = useState(false);

	return (
		<div
			className="absolute z-10 bottom-[3.375rem] -left-[72px]
        w-[41.625rem] pl-[72px] pb-2.5 pr-[0.9375rem] overflow-scroll no-scrollbar
        @mobile:-left-[0.9375rem] @mobile:w-[calc(100vw-16px)] @mobile:pl-[0.9375rem] @mobile:pr-8"
		>
			<div
				className="relative z-10 flex w-fit rounded-md
        bg-black-000 border border-black-200 shadow-predict-button"
				onTouchStart={() => setIsScrollVisible(true)}
				onTouchEnd={() => setTimeout(() => setIsScrollVisible(false), 500)}
			>
				{new Array(20).fill(null).map((_, i) => (
					<div key={i} className="flex items-center">
						<button
							className={clsx(
								`relative p-4 inset-0 before:content-[''] before:transition-all
                before:absolute before:z-20 before:top-0 before:left-0 before:bottom-0 before:right-0
                active:before:bg-primary-50 active:before:shadow-score-button-active 
              `,
								{ 'before:rounded-l-md': i === 0, 'before:rounded-r-md': i === 19 },
							)}
						>
							<div className="w-3 h-4 body4-medium flex items-center justify-center">{i + 1}</div>
						</button>
						{i + 1 !== 20 && <div className="h-9 border-r border-black-200"></div>}
					</div>
				))}
				<div
					className={clsx(
						'absolute w-full h-1.5 px-[0.3125rem] pt-0.5 z-20 bottom-0 rounded-b-md bg-black-100 transition-opacity',
						isScrollVisible ? 'opacity-100' : 'opacity-0',
					)}
				>
					<div className="w-[12.3125rem] h-[0.1875rem] rounded-full bg-black-500"></div>
				</div>
			</div>
		</div>
	);
}
