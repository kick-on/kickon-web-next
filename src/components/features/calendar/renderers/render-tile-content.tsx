import { isSameDate, stripTime } from '@/lib/utils';

interface TileContentProps {
	date: Date;
	markedDatesMap: Record<string, number>;
}

export const RenderTileContent: React.FC<TileContentProps> = ({ date, markedDatesMap }) => {
	const d = stripTime(date);
	const year = d.getFullYear();
	const month = String(d.getMonth() + 1).padStart(2, '0');
	const day = String(d.getDate()).padStart(2, '0');
	const dStr = `${year}-${month}-${day}`;

	const isToday = isSameDate(d, stripTime(new Date()));
	const count = markedDatesMap[dStr];

	return (
		<div className="flex flex-col items-center gap-1 mt-1">
			{isToday && <span className="w-10 font-semibold">오늘</span>}
			{count > 0 && (
				<div className="flex flex-row items-center gap-2">
					<div className="calendar-dot" />
					<span className="calendar-count">{count}</span>
				</div>
			)}
		</div>
	);
};
