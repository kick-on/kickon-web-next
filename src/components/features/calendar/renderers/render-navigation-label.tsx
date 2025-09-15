import { ArrowButton } from '../arrow-button';

interface RenderNavigationLabelParams {
	year: number;
	month: string;
	canGoPrev: boolean;
	canGoNext: boolean;
	onMonthChange: (direction: 'prev' | 'next') => void;
}

export const renderNavigationLabel = ({
	year,
	month,
	canGoPrev,
	canGoNext,
	onMonthChange,
}: RenderNavigationLabelParams) => (
	<div className="flex w-full flex-1 items-center justify-center">
		<div className="absolute left-0 @mobile:ml-5 ml-9 year">{year}년</div>

		<div className="relative w-full flex-1 flex items-center justify-center">
			{/* 왼쪽 화살표 */}
			<ArrowButton direction="prev" onClick={onMonthChange} show={canGoPrev} />

			{/* 월 중앙 */}
			{month && (
				<span className="flex justify-center items-center">
					<span className="month-number">{month.slice(0, -1)}</span>
					<span className="month-text">{month.slice(-1)}</span>
				</span>
			)}

			{/* 오른쪽 화살표 */}
			<ArrowButton direction="next" onClick={onMonthChange} show={canGoNext} />
		</div>
	</div>
);
