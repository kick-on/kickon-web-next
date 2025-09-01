'use client';

import useIsDesktop from '@/lib/hooks/useIsDesktop';
import useIsMobile from '@/lib/hooks/useIsMobile';
import clsx from 'clsx';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function FavoriteTeamHeader({
	isSignup,
	teamCount,
	onClickEditButton,
}: {
	isSignup: boolean;
	teamCount: number;
	onClickEditButton: () => void;
}) {
	// 프로필 설정 페이지에서 우측 편집 버튼
	const [isEditButtonVisible, setIsEditButtonVisible] = useState(!isSignup);

	const handleEditButtonClick = () => {
		setIsEditButtonVisible(!isEditButtonVisible);
		onClickEditButton();
	};

	// help circle
	const isDesktop = useIsDesktop();
	const isMobile = useIsMobile();
	const [isTooltipVisible, setIsTooltipVisible] = useState(false);

	const handleHelpCircle = (e: React.MouseEvent) => {
		if (isDesktop) {
			if (e.type === 'mouseover') setIsTooltipVisible(true);
			if (e.type === 'mouseleave') setIsTooltipVisible(false);
		} else {
			if (e.type === 'click') setIsTooltipVisible((prev) => !prev);
		}
	};

	useEffect(() => {
		if (isTooltipVisible && !isDesktop) {
			const tooltipTimer = setTimeout(() => {
				setIsTooltipVisible(false);
			}, 2000);

			const closeTooltip = () => setIsTooltipVisible(false);

			document.addEventListener('click', closeTooltip);

			return () => {
				clearTimeout(tooltipTimer);
				document.removeEventListener('click', closeTooltip);
			};
		}
	}, [isTooltipVisible, isDesktop]);

	return (
		<>
			<div className="text-subtitle-01 font-semibold mb-2 flex items-center justify-between">
				<div className="flex gap-1.5 items-center">
					<span>
						MY팀 {isSignup && '선택'} (<span className={clsx({ 'text-primary-900': isSignup })}>{teamCount}</span>
						/3)
					</span>

					<div className="relative flex items-center">
						<button onClick={handleHelpCircle} onMouseOver={handleHelpCircle} onMouseLeave={handleHelpCircle}>
							<Image src={'/help-circle.svg'} alt="도움말" width={12} height={12} />
						</button>

						{isTooltipVisible && (
							<div
								className={clsx(
									`absolute z-15 py-3 w-max bg-black-900/80 rounded-md text-caption-01 text-black-000 text-center
									starting:opacity-0 transition-opacity cursor-default`,
									isMobile
										? 'px-2.5 top-1/2 left-[1.625rem] -translate-y-1/2'
										: 'px-4 -top-[4.125rem] left-1/2 -translate-x-1/2',
								)}
							>
								MY팀은 6개월{isSignup ? ' 뒤에' : '에 한 번씩'} 변경 가능하며,
								<br />
								순위는 상시 변경 가능해요.
								<div
									className={clsx(
										`absolute
										border-x-8 border-t-8 border-t-black-900/80 border-x-transparent
										before:content-[''] before:absolute before:bg-black-000
										before:w-0.5 before:h-1 before:left-1/2 before:-translate-x-1/2 before:-bottom-px
										after:content-[''] after:absolute after:z-10 after:bg-black-900/80 after:rounded-b-xs
										after:w-0.5 after:h-0.5	after:left-1/2 after:-translate-x-1/2 after:bottom-px
										`,
										isMobile ? 'rotate-90 -left-3 top-1/2 -translate-y-1/2' : '-bottom-2 left-1/2 -translate-x-1/2 ',
									)}
								/>
							</div>
						)}
					</div>
				</div>
				{isEditButtonVisible && (
					<button onClick={handleEditButtonClick} className="ml-auto text-button-05 text-primary-900">
						편집
					</button>
				)}
			</div>
			<div className="text-caption-01 mb-6">
				* {isSignup && '최대 3순위까지 선택할 수 있으며, '}프로필에는 1순위만 표기돼요.
			</div>
		</>
	);
}
